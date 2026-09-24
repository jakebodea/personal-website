/// <reference types="bun/types" />

import { Glob, file } from "bun";

const output = new Glob("dist/**/*");
const privateMarkers = [
  ".resume-studio/",
  "career-evidence.md",
  "resume/resume.pdf",
  "resume/cover.tex",
];

let checked = 0;
for await (const path of output.scan({ onlyFiles: true })) {
  checked += 1;
  if (privateMarkers.some((marker) => path.includes(marker))) {
    throw new Error(`Private path in deploy output: ${path}`);
  }
  if (!/\.(?:js|json|html|css|txt)$/u.test(path)) {
    continue;
  }
  const contents = await file(path).text();
  const marker = privateMarkers.find((value) => contents.includes(value));
  if (marker !== undefined && marker !== "") {
    throw new Error(`Private marker ${marker} in deploy output: ${path}`);
  }
}

if (checked === 0) {
  throw new Error("No deploy output found. Run bun run build first.");
}
console.log(
  `Checked ${checked} deployment files for private Resume Studio material.`
);
