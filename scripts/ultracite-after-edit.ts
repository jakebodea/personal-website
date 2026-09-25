#!/usr/bin/env bun
/// <reference types="bun/types" />

import { $, file, stdin } from "bun";

interface HookPayload {
  file_path?: string;
  tool_input?: {
    file_path?: string;
    path?: string;
  };
}

const isHookPayload = (value: unknown): value is HookPayload =>
  typeof value === "object" && value !== null;

const resolveEditedPath = (payload: HookPayload): string | undefined =>
  payload.file_path ??
  payload.tool_input?.file_path ??
  payload.tool_input?.path;

const text = await stdin.text();
const trimmed = text.trim();
if (trimmed === "") {
  process.exit(0);
}

let parsed: unknown;
try {
  parsed = JSON.parse(trimmed);
} catch {
  process.exit(0);
}

if (!isHookPayload(parsed)) {
  process.exit(0);
}

const editedPath = resolveEditedPath(parsed);
if (editedPath === undefined || editedPath === "") {
  process.exit(0);
}

if (!(await file(editedPath).exists())) {
  process.exit(0);
}

await $`bunx oxfmt ${editedPath}`;
