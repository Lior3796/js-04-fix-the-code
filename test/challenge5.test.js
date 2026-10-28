import { test } from "node:test";
import assert from "node:assert/strict";
import { load, runScript } from "./helpers.js";

const FILE = "challenge5-cart/cart.js";

test("Challenge 5: getTotal multiplies price by quantity for each item", async () => {
  const { getTotal } = await load(FILE);
  assert.equal(getTotal(), 14, `the total should be 2*3 + 1*5 + 1.5*2 = 14 (got ${getTotal()})`);
});

test("Challenge 5: works on the current cart, not a fixed answer", async () => {
  const { cart, getTotal } = await load(FILE);
  cart.push({ name: "Melon", price: 10, quantity: 2 });
  assert.equal(getTotal(), 34, "after adding 2 melons at 10 each, the total should be 14 + 20 = 34");
  cart.length = 0;
  assert.equal(getTotal(), 0, "an empty cart should have a total of 0");
});

test("Challenge 5: running app.js prints 14", () => {
  const lines = runScript("challenge5-cart/app.js");
  assert.deepEqual(lines, ["14"], `node challenge5-cart/app.js should print 14 (got ${JSON.stringify(lines)})`);
});
