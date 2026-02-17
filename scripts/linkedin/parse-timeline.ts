import { timelineItems } from "../../content/timeline-data";
import type {
  LinkedInDateParts,
  LinkedInExperienceEntry,
  TimelineItem,
} from "./types";

type ParseCliOptions = {
  dryRun: boolean;
  outFile: string | null;
  limit: number | null;
  startAt: number;
};

const MONTH_TO_NUMBER: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const DATE_PATTERN = /^([A-Za-z]+)\s+(\d{4})$/;

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDate(value: string): LinkedInDateParts | null {
  if (value.toLowerCase() === "present") {
    return null;
  }

  const match = value.match(DATE_PATTERN);
  if (!match) {
    throw new Error(`Unsupported date format "${value}". Expected "Month YYYY".`);
  }

  const monthRaw = match[1];
  const monthNumber = MONTH_TO_NUMBER[monthRaw.toLowerCase()];
  if (!monthNumber) {
    throw new Error(`Unsupported month "${monthRaw}" in "${value}".`);
  }

  return {
    month: monthRaw,
    monthNumber,
    year: Number.parseInt(match[2], 10),
    isPresent: false,
  };
}

function toDescription(bullets: string[]): string {
  return bullets.map((bullet) => `- ${bullet}`).join("\n");
}

function isExperienceEntry(item: TimelineItem): boolean {
  return item.title.trim().toLowerCase() !== "student";
}

function sortByStartDateDesc(
  entries: LinkedInExperienceEntry[],
): LinkedInExperienceEntry[] {
  return [...entries].sort((left, right) => {
    if (left.startDate.year !== right.startDate.year) {
      return right.startDate.year - left.startDate.year;
    }

    return right.startDate.monthNumber - left.startDate.monthNumber;
  });
}

export function getLinkedInExperienceEntries(): LinkedInExperienceEntry[] {
  const experienceEntries = (timelineItems as TimelineItem[])
    .filter(isExperienceEntry)
    .map((item, index) => {
      const startDate = parseDate(item.startDate);
      if (!startDate) {
        throw new Error(`startDate cannot be "Present" for "${item.title}".`);
      }

      const maybeEndDate = parseDate(item.endDate);
      const isCurrentRole = item.endDate.toLowerCase() === "present";

      if (!isCurrentRole && !maybeEndDate) {
        throw new Error(`Invalid endDate "${item.endDate}" for "${item.title}".`);
      }

      return {
        id: `${toSlug(item.location)}-${toSlug(item.title)}-${index + 1}`,
        title: item.title,
        company: item.location,
        location: "",
        startDateRaw: item.startDate,
        endDateRaw: item.endDate,
        startDate,
        endDate: isCurrentRole ? null : maybeEndDate,
        isCurrentRole,
        description: toDescription(item.bullets),
        bullets: item.bullets,
      };
    });

  return sortByStartDateDesc(experienceEntries);
}

function parseCliOptions(argv: string[]): ParseCliOptions {
  const options: ParseCliOptions = {
    dryRun: false,
    outFile: null,
    limit: null,
    startAt: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--out") {
      options.outFile = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg.startsWith("--out=")) {
      options.outFile = arg.slice("--out=".length);
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

async function run(): Promise<void> {
  const options = parseCliOptions(Bun.argv.slice(2));
  const entries = getLinkedInExperienceEntries();
  const selectedEntries = selectEntries(entries, options.startAt, options.limit);

  const jsonOutput = JSON.stringify(selectedEntries, null, 2);

  if (options.dryRun || !options.outFile) {
    console.log(jsonOutput);
  }

  if (options.outFile) {
    await Bun.write(options.outFile, `${jsonOutput}\n`);
    console.log(`Wrote ${selectedEntries.length} experience entries to ${options.outFile}.`);
  }
}

if (import.meta.main) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
