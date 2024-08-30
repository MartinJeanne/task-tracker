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

const tasks: Task[] = [{ name: "First task", status: Satus.todo }];

function taskToString(t: Task): string {
    return `id: ${tasks.indexOf(t) + 1}, name: "${t.name}", status: ${t.status}`;
}

rl.on('line', (line: string) => {
    const args: string[] = line.split(' ');

    switch (args[0]) {
        case 'list':
            tasks.forEach(t => console.log(taskToString(t)));
            break;
        case 'add':
            const newTask: Task = { name: args[1], status: Satus.todo }
            tasks.push(newTask);
            console.log('New task added: ' + taskToString(tasks[tasks.length - 1]));
            break;
        case 'update':
            console.log('todo');
            break;
        case 'delete':
            const idToDelete = parseInt(args[1]);
            if (Number.isNaN(idToDelete)) {
                console.log(`Invalid task id: "${args[1]}"`);
                break;
            }

            const task = tasks[idToDelete - 1];
            if (!task) {
                console.log(`No task found with id: ${idToDelete}`);
                break;
            }
            console.log(`Deleted task: ${taskToString(task)}`);
            tasks.splice(idToDelete - 1, 1)
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
