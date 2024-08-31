import CLI from './CLI';
import InputError from './error/InputError';
import JSONParseError from './error/JSONParseError';
import Input from './Input';
import Task from './Task';
import TaskCollection from './TaskCollection';

const cli = new CLI();
const tasksCollection = TaskCollection.instance;

const onLine = async (line: string) => {
    let input: Input;
    let tasks: Task[];

    try {
        input = new Input(line);
        tasks = await tasksCollection.getTasks();
    } catch (error) {
        if (error instanceof InputError) {
            console.warn(error.message);
        } else if (error instanceof JSONParseError) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        return;
    }

    switch (input.getCmdName()) {
        case 'list':
            if (input.getArg(0)) {
                tasks = tasks.filter(t => t.getStatus() === input.getArg(0));
            }
            tasks.forEach(t => console.log(t.toString()));
            break;

        case 'add':
            const nextId = await tasksCollection.nextValidId();
            const newTask = new Task(nextId, input.getArg(0));
            tasks.push(newTask);
            await tasksCollection.setTasks(tasks);
            console.log('New task added: ' + newTask.toString());
            break;

        default:
            break;
    }
}

cli.onLineListener(onLine);
cli.onCloseListener();
cli.start();
