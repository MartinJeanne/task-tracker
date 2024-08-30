import * as readline from 'node:readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'task-cli ',
});

console.log('Welcome to the task-tracker CLI!');
rl.prompt();

enum Satus {
    todo = "todo",
    ongoing = "ongoing",
    done = "done"
}

type Task = {
    name: string;
    status: Satus;
}

const tasks: Task[] = [
    { name: "First task", status: Satus.todo },
    { name: "Second task", status: Satus.ongoing },
    { name: "Third task", status: Satus.done }
];

rl.on('line', (line: string) => {
    const args: string[] = line.split(' ');

    switch (args[0]) {
        case 'list':
            let tasksToList;
            if (args[1]) {
                tasksToList = tasks.filter(t => t.status === args[1]);
            } else {
                tasksToList = tasks;
            }

            tasksToList.forEach(t => console.log(taskToString(t)));
            break;

        case 'add':
            const newTask: Task = { name: args[1], status: Satus.todo }
            tasks.push(newTask);
            console.log('New task added: ' + taskToString(tasks[tasks.length - 1]));
            break;

        case 'update':
            const toUpdate = getTaskFromArg(args[1]);
            if (!toUpdate) break;
            const newName = args[2];
            toUpdate.name = newName;
            //todo
            break;

        case 'delete':
            const toDelete = getTaskFromArg(args[1]);
            if (!toDelete) break;
            console.log(`Deleted task: ${taskToString(toDelete)}`);
            tasks.splice(tasks.indexOf(toDelete) - 1, 1)
            break;

        default:
            console.log(`Say what?`);
            console.log(`Possible arguments: list, add, update, delete`);
            break;
    }
    rl.prompt();
});

rl.on('close', () => {
    console.log('\nHave a great day!');
    process.exit(0);
});

function taskToString(t: Task): string {
    return `id: ${tasks.indexOf(t) + 1}, name: "${t.name}", status: ${t.status}`;
}

function getTaskFromArg(arg: string): Task | null {
    const taskId = parseInt(arg);
    if (Number.isNaN(taskId)) {
        console.log(`Invalid task id: "${arg}"`);
        return null;
    }

    const task = tasks[taskId - 1];
    if (!task) {
        console.log(`No task found with id: ${taskId}`);
        return null;
    }
    return task;
}