import { test } from "node:test";
import assert from "node:assert/strict";
import { load, captureConsole, runScript } from "./helpers.js";

const FILE = "challenge4-temperature/tempTracker.js";

// Reads the number from a line like "Average temperature: 22.5".
function averageIn(line) {
  const match = /^Average temperature: (-?\d+(\.\d+)?)$/.exec(line.trim());
  assert.ok(match, `each line should look like "Average temperature: 22.5" (got "${line}")`);
  return Number(match[1]);
}

test("Challenge 4: the first reading logs itself as the average", async () => {
  const { addTemperature } = await load(FILE);
  const lines = captureConsole(() => addTemperature(20));
  assert.equal(lines.length, 1, "addTemperature should log one line every time it is called");
  assert.equal(averageIn(lines[0]), 20, "after adding 20 the average is 20");
});

test("Challenge 4: logs the correct average after every addition", async () => {
  const { addTemperature } = await load(FILE);
  const lines = captureConsole(() => {
    addTemperature(20);
    addTemperature(25);
    addTemperature(30);
  });
  assert.equal(lines.length, 3, "three calls should log three lines");
  assert.deepEqual(lines.map(averageIn), [20, 22.5, 25], "the averages should be 20, then 22.5 (20+25)/2, then 25 (20+25+30)/3");
});

test("Challenge 4: works with other numbers too", async () => {
  const { addTemperature } = await load(FILE);
  const lines = captureConsole(() => {
    addTemperature(10);
    addTemperature(-4);
    addTemperature(0);
    addTemperature(14);
  });
  assert.deepEqual(lines.map(averageIn), [10, 3, 2, 5], "adding 10, -4, 0, 14 should log the averages 10, 3, 2, 5");
});

test("Challenge 4: running main.js logs 3 correct averages", () => {
  const lines = runScript("challenge4-temperature/main.js");
  assert.deepEqual(lines.map(averageIn), [20, 22.5, 25], "node challenge4-temperature/main.js should log the averages 20, 22.5, 25");
});
