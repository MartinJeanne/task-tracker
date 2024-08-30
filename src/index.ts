import * as fs from 'node:fs/promises';
import * as readline from 'node:readline';
//import handleAdd from './handleAdd';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'task-cli ',
});

console.log('Welcome to the task-tracker CLI!');
rl.prompt();

enum Status {
    todo = 'todo',
    inPogress = 'in-progress',
    done = 'done'
}

type Task = {
    name: string;
    status: Status;
}

rl.on('line', async (line: string) => {
    const args: string[] = line.split(' ');
    const tasks = await readTasks();

    switch (args[0]) {
        case 'list':
            if (tasks.length === 0) {
                console.warn('No task');
                break;
            }

            let tasksToList = tasks;
            if (args[1]) {
                tasksToList = tasksToList.filter(t => t.status === args[1]);
            }
            tasksToList.forEach(t => console.log(taskToString(tasks, t)));
            break;

        case 'add':
            args.shift();
            const newTask: Task = { name: args.join(' '), status: Status.todo }
            tasks.push(newTask);
            await writeTasks(tasks);
            console.log('New task added: ' + taskToString(tasks, tasks[tasks.length - 1]));
            break;

        case 'update': {
            if (tasks.length === 0) {
                console.warn('No task');
                break;
            }

            const toUpdate = getTaskFromArg(tasks, args[1]);
            if (!toUpdate) break;
            const index = tasks.indexOf(toUpdate);
            const newName = args[2];
            tasks[index] = { name: newName, status: toUpdate.status };
            await writeTasks(tasks);
            console.log('Task updated: ' + taskToString(tasks, tasks[index]));
            break;
        }

        case 'mark': {
            if (tasks.length === 0) {
                console.warn('No task');
                break;
            }

            const toUpdate = getTaskFromArg(tasks, args[1]);
            if (!toUpdate) break;
            const index = tasks.indexOf(toUpdate);
            const newStatus = args[2] as Status;
            if (!Object.values(Status).includes(newStatus)) {
                console.error('Invalid status: ' + newStatus);
                break;
            }
            tasks[index] = { name: toUpdate.name, status: newStatus };
            await writeTasks(tasks);
            console.log('Task updated: ' + taskToString(tasks, tasks[index]));
            break;
        }

        case 'delete': if (tasks.length === 0) {
            console.warn('No task');
            break;
        }

            const toDelete = getTaskFromArg(tasks, args[1]);
            if (!toDelete) break;
            console.log(`Deleted task: ${taskToString(tasks, toDelete)}`);
            tasks.splice(tasks.indexOf(toDelete), 1);
            await writeTasks(tasks);
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

async function readTasks(): Promise<Task[]> {
    return await fs.readFile('./tasks.json', { encoding: 'utf8' })
        .then(json => JSON.parse(json))
        .catch(async e => {
            if (e.code === 'ENOENT') {
                await writeTasks([]);
                return [];
            }
            else console.error(e);
        });
}

async function writeTasks(tasks: Task[]) {
    const json = JSON.stringify(tasks);
    await fs.writeFile('./tasks.json', json, { encoding: 'utf8' });
}

function taskToString(tasks: Task[], t: Task): string {
    return `id: ${tasks.indexOf(t) + 1}, name: "${t.name}", status: ${t.status}`;
}

function getTaskFromArg(tasks: Task[], arg: string): Task | null {
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
