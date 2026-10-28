import { test } from "node:test";
import assert from "node:assert/strict";
import { load, runScript } from "./helpers.js";

const FILE = "challenge3-todo/todo.js";

test("Challenge 3: getPendingTasks returns only the tasks that are not completed", async () => {
  const { getPendingTasks } = await load(FILE);
  const pending = getPendingTasks();
  assert.ok(Array.isArray(pending), "getPendingTasks should return an array");
  assert.deepEqual(pending, [{ id: 2, title: "Walk dog", completed: false }], `only "Walk dog" is not completed (got the titles ${JSON.stringify(pending.map((task) => task?.title))})`);
});

test("Challenge 3: works on the current tasks list, not a fixed answer", async () => {
  const { tasks, getPendingTasks } = await load(FILE);
  tasks.push({ id: 4, title: "Cook dinner", completed: false });
  tasks.push({ id: 5, title: "Do homework", completed: true });
  const titles = getPendingTasks().map((task) => task.title);
  assert.deepEqual(titles, ["Walk dog", "Cook dinner"], `after adding tasks, every task with completed: false should be returned, in order (got ${JSON.stringify(titles)})`);
});

test("Challenge 3: does not change the original tasks list", async () => {
  const { tasks, getPendingTasks } = await load(FILE);
  const pending = getPendingTasks();
  assert.equal(pending.length, 1, `getPendingTasks should return 1 pending task (got ${pending.length})`);
  assert.equal(tasks.length, 3, "the tasks array itself should still have all 3 tasks - filter returns a new array");
});

test("Challenge 3: running main.js shows only the pending task", () => {
  const output = runScript("challenge3-todo/main.js").join("\n");
  assert.match(output, /Walk dog/, "node challenge3-todo/main.js should print the \"Walk dog\" task");
  assert.doesNotMatch(output, /Buy milk|Read book/, "completed tasks (Buy milk, Read book) should not be printed");
});
