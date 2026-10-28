export const tasks = [
    { id: 1, title: "Buy milk", completed: true },
    { id: 2, title: "Walk dog", completed: false },
    { id: 3, title: "Read book", completed: true },
];

export function getPendingTasks() {
    return tasks.filter(task => {
        if (task.completed) {
            return true;
        }
    });
}
