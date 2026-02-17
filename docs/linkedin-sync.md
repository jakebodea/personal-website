# LinkedIn Timeline Sync

These scripts parse timeline data from `content/timeline-data.ts` and help you
add Experience entries on LinkedIn with a safer semi-automated flow.

## Install

From repo root:

```bash
bun install
bun run linkedin:install-browser
```

## Parse timeline data

Preview normalized experience entries:

```bash
bun run linkedin:parse
```

Write parsed entries to JSON:

```bash
bun run linkedin:parse:json
```

Optional flags for parser:

- `--limit <n>`: only include first `n` entries after filtering
- `--start-at <n>`: skip first `n` entries
- `--out <path>`: write JSON to custom path
- `--dry-run`: print JSON to stdout

Example:

```bash
bun scripts/linkedin/parse-timeline.ts --start-at 1 --limit 2 --out /tmp/linkedin.json
```

## Run LinkedIn autofill

Dry-run (no browser actions):

```bash
bun run linkedin:fill:dry
```

Interactive browser mode (recommended first run):

```bash
bun run linkedin:fill
```

Safer first test (single entry):

```bash
bun run linkedin:fill -- --limit 1
```

Enable auto-save clicks after filling:

```bash
bun run linkedin:fill -- --submit
```

## Autofill behavior

- Opens `https://www.linkedin.com/in/me/details/experience/`
- Reuses browser profile at `.linkedin-profile/` so login persists
- Attempts to fill stable fields (title, company, description)
- Prompts you for manual help when selectors are brittle
- By default does **not** auto-submit; use `--submit` to enable save clicks

## Fill script flags

- `--dry-run`: print entries and exit
- `--limit <n>`: process first `n` selected entries
- `--start-at <n>`: skip first `n` entries
- `--submit`: click save when possible
- `--headless <true|false>`: run browser headless (default `false`)
- `--profile-url <url>`: custom LinkedIn experience page
- `--user-data-dir <path>`: custom persistent browser profile dir

## Notes

- This path does not use LinkedIn API credentials.
- Keep any sensitive local settings in `.env.local`; do not commit secrets.
- LinkedIn UI changes can break selectors. When this happens, the script asks
  for manual completion instead of guessing.
