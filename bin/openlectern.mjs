#!/usr/bin/env node
// OpenLectern CLI entry point. Loads the TypeScript sources through tsx so no build step is needed.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { register } from "tsx/esm/api";

register();
const here = path.dirname(fileURLToPath(import.meta.url));
await import(pathToFileURL(path.join(here, "..", "src", "cli", "index.ts")).href);
