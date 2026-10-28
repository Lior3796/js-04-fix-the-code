import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let loadCount = 0;

// Imports a student module fresh (a new copy every time), so every test starts with clean state.
export async function load(relativePath) {
  const url = `${pathToFileURL(path.join(ROOT, relativePath)).href}?fresh=${++loadCount}`;
  try {
    return await import(url);
  } catch (err) {
    throw new Error(`could not load ${relativePath}: ${err.message}`);
  }
}

// Runs fn and returns everything it printed with console.log, one string per call.
export function captureConsole(fn) {
  const lines = [];
  const original = console.log;
  console.log = (...args) => lines.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
  try {
    fn();
  } finally {
    console.log = original;
  }
  return lines;
}

// Removes terminal color codes, e.g. "\u001b[33m14\u001b[39m" -> "14".
const stripColors = (text) => text.replace(/\u001b\[[0-9;]*m/g, "");

// Runs a student file with node (like "node challenge1-greeting/main.js") and returns its output lines.
export function runScript(relativePath, { timeout = 5000 } = {}) {
  // Without colors: when FORCE_COLOR is set, console.log prints numbers in color.
  const env = { ...process.env, NO_COLOR: "1" };
  delete env.FORCE_COLOR;
  const result = spawnSync(process.execPath, [path.join(ROOT, relativePath)], { cwd: ROOT, env, encoding: "utf8", timeout });
  if (result.error?.code === "ETIMEDOUT") {
    throw new Error(`${relativePath} did not finish within ${timeout / 1000}s - is it stuck in a loop?`);
  }
  if (result.status !== 0) {
    const firstError = result.stderr.split(/\r?\n/).find((line) => /Error/.test(line)) || result.stderr.trim();
    throw new Error(`running ${relativePath} crashed: ${firstError}`);
  }
  return stripColors(result.stdout).split(/\r?\n/).filter((line) => line.trim() !== "");
}
