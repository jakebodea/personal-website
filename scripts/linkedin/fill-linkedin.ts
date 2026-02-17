import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { chromium, type Page } from "playwright";

import { getLinkedInExperienceEntries } from "./parse-timeline";
import type { LinkedInExperienceEntry } from "./types";

type FillCliOptions = {
  dryRun: boolean;
  limit: number | null;
  startAt: number;
  headless: boolean;
  profileUrl: string;
  userDataDir: string;
  submit: boolean;
};

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }
  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  throw new Error(`Invalid boolean value "${value}".`);
}

function parseCliOptions(argv: string[]): FillCliOptions {
  const options: FillCliOptions = {
    dryRun: false,
    limit: null,
    startAt: 0,
    headless: false,
    profileUrl: "https://www.linkedin.com/in/me/details/experience/",
    userDataDir: ".linkedin-profile",
    submit: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--submit") {
      options.submit = true;
      continue;
    }

    if (arg === "--limit") {
      options.limit = Number.parseInt(argv[i + 1] ?? "", 10);
      i += 1;
      continue;
    }

    if (arg.startsWith("--limit=")) {
      options.limit = Number.parseInt(arg.slice("--limit=".length), 10);
      continue;
    }

    if (arg === "--start-at") {
      options.startAt = Number.parseInt(argv[i + 1] ?? "", 10);
      i += 1;
      continue;
    }

    if (arg.startsWith("--start-at=")) {
      options.startAt = Number.parseInt(arg.slice("--start-at=".length), 10);
      continue;
    }

    if (arg === "--headless") {
      options.headless = parseBoolean(argv[i + 1], false);
      i += 1;
      continue;
    }

    if (arg.startsWith("--headless=")) {
      options.headless = parseBoolean(arg.slice("--headless=".length), false);
      continue;
    }

    if (arg === "--profile-url") {
      options.profileUrl = argv[i + 1] ?? options.profileUrl;
      i += 1;
      continue;
    }

    if (arg.startsWith("--profile-url=")) {
      options.profileUrl = arg.slice("--profile-url=".length);
      continue;
    }

    if (arg === "--user-data-dir") {
      options.userDataDir = argv[i + 1] ?? options.userDataDir;
      i += 1;
      continue;
    }

    if (arg.startsWith("--user-data-dir=")) {
      options.userDataDir = arg.slice("--user-data-dir=".length);
      continue;
    }
  }

  if (Number.isNaN(options.startAt) || options.startAt < 0) {
    throw new Error("--start-at must be a number >= 0.");
  }

  if (
    options.limit !== null &&
    (Number.isNaN(options.limit) || options.limit <= 0)
  ) {
    throw new Error("--limit must be a positive number when provided.");
  }

  return options;
}

function selectEntries(
  entries: LinkedInExperienceEntry[],
  startAt: number,
  limit: number | null,
): LinkedInExperienceEntry[] {
  const sliced = entries.slice(startAt);
  return limit === null ? sliced : sliced.slice(0, limit);
}

async function maybeWaitForLogin(page: Page, rl: ReturnType<typeof createInterface>) {
  const maybeSignInField = page.locator("input[name='session_key']");
  const signInVisible = await maybeSignInField.first().isVisible().catch(() => false);
  if (!signInVisible) {
    return;
  }

  console.log("LinkedIn login required in opened browser.");
  await rl.question("Log in manually, then press Enter to continue...");
}

async function clickIfVisible(page: Page, textPattern: RegExp): Promise<boolean> {
  const button = page.getByRole("button", { name: textPattern }).first();
  const visible = await button.isVisible().catch(() => false);
  if (!visible) {
    return false;
  }
  await button.click();
  return true;
}

async function fillByLabel(
  page: Page,
  labelPattern: RegExp,
  value: string,
): Promise<boolean> {
  if (!value.trim()) {
    return false;
  }

  const field = page.getByLabel(labelPattern).first();
  const visible = await field.isVisible().catch(() => false);
  if (!visible) {
    return false;
  }
  await field.fill(value);
  return true;
}

async function selectMonthYear(
  page: Page,
  mode: "start" | "end",
  month: string,
  year: number,
): Promise<boolean> {
  const monthLabel = mode === "start" ? /start month/i : /end month/i;
  const yearLabel = mode === "start" ? /start year/i : /end year/i;

  const monthField = page.getByLabel(monthLabel).first();
  const yearField = page.getByLabel(yearLabel).first();
  const monthVisible = await monthField.isVisible().catch(() => false);
  const yearVisible = await yearField.isVisible().catch(() => false);
  if (!monthVisible || !yearVisible) {
    return false;
  }

  await monthField.selectOption({ label: month }).catch(async () => {
    await monthField.selectOption(month);
  });
  await yearField.selectOption(String(year));
  return true;
}

async function addSingleExperience(
  page: Page,
  entry: LinkedInExperienceEntry,
  options: FillCliOptions,
  rl: ReturnType<typeof createInterface>,
): Promise<void> {
  console.log(`\nProcessing: ${entry.title} @ ${entry.company}`);

  const opened =
    (await clickIfVisible(page, /add position/i)) ||
    (await clickIfVisible(page, /add experience/i)) ||
    (await clickIfVisible(page, /^add$/i));

  if (!opened) {
    console.log("Could not find add button automatically.");
    await rl.question("Open the Experience add form manually, then press Enter...");
  }

  await page.waitForTimeout(500);

  const titleFilled = await fillByLabel(page, /^title/i, entry.title);
  const companyFilled = await fillByLabel(
    page,
    /company name|company or organization/i,
    entry.company,
  );
  await fillByLabel(page, /^location/i, entry.location);
  await fillByLabel(page, /^description/i, entry.description);

  if (!titleFilled || !companyFilled) {
    console.log("Title/company selectors were not fully reliable on this page.");
    console.log("Use the text below to fill missing fields manually:");
    console.log(JSON.stringify(entry, null, 2));
    await rl.question("Press Enter after you complete missing fields...");
  }

  const startSelected = await selectMonthYear(
    page,
    "start",
    entry.startDate.month,
    entry.startDate.year,
  );

  if (!startSelected) {
    console.log(`Set start date manually to ${entry.startDateRaw}.`);
    await rl.question("Press Enter after setting start date...");
  }

  if (entry.isCurrentRole) {
    const currentRoleCheckbox = page
      .getByLabel(/currently work in this role|currently working/i)
      .first();
    const checkboxVisible = await currentRoleCheckbox
      .isVisible()
      .catch(() => false);
    if (checkboxVisible) {
      const checked = await currentRoleCheckbox.isChecked();
      if (!checked) {
        await currentRoleCheckbox.check();
      }
    }
  } else if (entry.endDate) {
    const endSelected = await selectMonthYear(
      page,
      "end",
      entry.endDate.month,
      entry.endDate.year,
    );

    if (!endSelected) {
      console.log(`Set end date manually to ${entry.endDateRaw}.`);
      await rl.question("Press Enter after setting end date...");
    }
  }

  if (!options.submit) {
    console.log("Submit is disabled. Review and save this entry manually.");
    await rl.question("Press Enter after you save or cancel this entry...");
    return;
  }

  const saved =
    (await clickIfVisible(page, /^save$/i)) ||
    (await clickIfVisible(page, /apply/i));
  if (!saved) {
    console.log("Could not auto-click Save. Save manually.");
    await rl.question("Press Enter after saving...");
  }
}

async function run(): Promise<void> {
  const options = parseCliOptions(Bun.argv.slice(2));
  const allEntries = getLinkedInExperienceEntries();
  const entries = selectEntries(allEntries, options.startAt, options.limit);

  if (entries.length === 0) {
    console.log("No experience entries selected.");
    return;
  }

  if (options.dryRun) {
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  const rl = createInterface({ input, output });
  const context = await chromium.launchPersistentContext(options.userDataDir, {
    headless: options.headless,
  });

  try {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(options.profileUrl, { waitUntil: "domcontentloaded" });
    await maybeWaitForLogin(page, rl);

    console.log(`Loaded ${entries.length} entries.`);
    if (!options.submit) {
      console.log("Running in non-submit mode for safety.");
    }

    for (const [index, entry] of entries.entries()) {
      console.log(`\n[${index + 1}/${entries.length}] ${entry.title} @ ${entry.company}`);
      await addSingleExperience(page, entry, options, rl);
      await page.waitForTimeout(500);
      await page.goto(options.profileUrl, { waitUntil: "domcontentloaded" });
    }
  } finally {
    await context.close();
    rl.close();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
