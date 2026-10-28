import { test } from "node:test";
import assert from "node:assert/strict";
import { load, captureConsole, runScript } from "./helpers.js";

const FILE = "challenge1-greeting/userSystem.js";

test("Challenge 1: a new user gets \"Welcome, <name>!\"", async () => {
  const { greetUser } = await load(FILE);
  const lines = captureConsole(() => greetUser("Alice"));
  assert.deepEqual(lines, ["Welcome, Alice!"], `the first time Alice is greeted it should print: Welcome, Alice! (got ${JSON.stringify(lines)})`);
});

test("Challenge 1: a returning user gets \"Welcome back, <name>!\"", async () => {
  const { greetUser } = await load(FILE);
  const lines = captureConsole(() => {
    greetUser("Alice");
    greetUser("Alice");
  });
  assert.deepEqual(lines, ["Welcome, Alice!", "Welcome back, Alice!"], `greeting Alice twice should print Welcome, then Welcome back (got ${JSON.stringify(lines)})`);
});

test("Challenge 1: every user is remembered separately, also after many visits", async () => {
  const { greetUser } = await load(FILE);
  const lines = captureConsole(() => {
    greetUser("Alice");
    greetUser("Bob");
    greetUser("Alice");
    greetUser("Alice");
    greetUser("Bob");
    greetUser("Dana");
  });
  assert.deepEqual(
    lines,
    ["Welcome, Alice!", "Welcome, Bob!", "Welcome back, Alice!", "Welcome back, Alice!", "Welcome back, Bob!", "Welcome, Dana!"],
    `only the first visit of each user is "Welcome", every later visit is "Welcome back" (got ${JSON.stringify(lines)})`
  );
});

test("Challenge 1: running main.js prints the expected greetings", () => {
  const lines = runScript("challenge1-greeting/main.js");
  assert.deepEqual(lines, ["Welcome, Alice!", "Welcome, Bob!", "Welcome back, Alice!"], `node challenge1-greeting/main.js should print these 3 lines (got ${JSON.stringify(lines)})`);
});
