import { test } from "node:test";
import assert from "node:assert/strict";
import { load, runScript } from "./helpers.js";

const FILE = "challenge2-discount/discount.js";

// Prices with discounts are not always exact in JavaScript (0.1 + 0.2 !== 0.3), so compare with a small tolerance.
function assertPrice(actual, expected, message) {
  assert.equal(typeof actual, "number", `${message} (got ${actual})`);
  assert.ok(Math.abs(actual - expected) < 1e-9, `${message} (got ${actual})`);
}

test("Challenge 2: prices from 20 up to 100 get 5% off", async () => {
  const { calculateDiscount } = await load(FILE);
  assertPrice(calculateDiscount(50), 47.5, "calculateDiscount(50) should return 47.5");
  assertPrice(calculateDiscount(20), 19, "calculateDiscount(20) should return 19 - 20 is not under 20, so it gets 5% off");
  assertPrice(calculateDiscount(100), 95, "calculateDiscount(100) should return 95 - 100 is not over 100, so it gets 5% off");
});

test("Challenge 2: prices under 20 get no discount", async () => {
  const { calculateDiscount } = await load(FILE);
  assertPrice(calculateDiscount(50), 47.5, "calculateDiscount(50) should return 47.5 - check the if for prices under 20");
  assertPrice(calculateDiscount(15), 15, "calculateDiscount(15) should return 15");
  assertPrice(calculateDiscount(19), 19, "calculateDiscount(19) should return 19");
});

test("Challenge 2: prices over 100 get 10% off", async () => {
  const { calculateDiscount } = await load(FILE);
  assertPrice(calculateDiscount(150), 135, "calculateDiscount(150) should return 135");
  assertPrice(calculateDiscount(200), 180, "calculateDiscount(200) should return 180");
  assertPrice(calculateDiscount(100), 95, "calculateDiscount(100) should return 95 - only prices over 100 get 10% off");
});

test("Challenge 2: running app.js prints 135, 15 and 47.5", () => {
  const lines = runScript("challenge2-discount/app.js");
  assert.deepEqual(lines, ["135", "15", "47.5"], `node challenge2-discount/app.js should print 135, 15, 47.5 (got ${JSON.stringify(lines)})`);
});
