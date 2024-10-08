import CLI from './CLI';
import InputError from './error/InputError';
import Input from './Input';
import Task from './Task';
import TaskRepository from './TaskRepository';
import { CommandName } from './types';

const taskRepo = new TaskRepository();

const onNewLine = async (line: string) => {
    let input: Input;

    try {
        input = new Input(line);
    } catch (error) {
        if (error instanceof InputError) {
            console.warn(error.message);
        } else {
            console.error(error);
        }
        return;
    }

    switch (input.getCmdName()) {
        case CommandName.list: {
            let tasks = await taskRepo.findAll();
            if (input.getArg(0)) {
                tasks = tasks.filter(t => t.getStatus() === input.getArg(0));
            }
            tasks.forEach(t => console.log(t.toString()));
            break;
        }

        case CommandName.add: {
            const newTask = new Task(input.getArg(0));
            await taskRepo.save(newTask);
            break;
        }

        case CommandName.update: {
            const id = parseInt(input.getArg(0));
            const newDescription = input.getArg(1);

            const toUpdate = await taskRepo.findById(id);
            if (!toUpdate) {
                console.warn(`No task whith id: ${id}`)
                break;
            }

            toUpdate.setDescription(newDescription);
            toUpdate.setUpdatedAt(new Date());
            await taskRepo.save(toUpdate);
            break;
        }

        case CommandName.mark: {
            const id = parseInt(input.getArg(0));
            const newStatus = input.getArg(1);

            const toUpdate = await taskRepo.findById(id);
            if (!toUpdate) {
                console.warn(`No task whith id: ${id}`)
                break;
            }

            if (!Task.isStatus(newStatus)) {
                console.warn(`Invalid status: ${newStatus}`);
                break;
            }

            toUpdate.setSatus(newStatus);
            toUpdate.setUpdatedAt(new Date());
            await taskRepo.save(toUpdate);
            break;
        }

        case CommandName.delete: {
            const id = parseInt(input.getArg(0));

            const toDelete = await taskRepo.findById(id);
            if (!toDelete) {
                console.warn(`No task whith id: ${id}`)
                break;
            }
            await taskRepo.delete(toDelete);
            break;
        }

        case CommandName.help: {
            const availableCmds = Input.availableCommands;
            if (!input.getArg(0) || !Input.isCommandName(input.getArg(0))) {
                const helpCmld = availableCmds.find(cmd => cmd.name === CommandName.help);
                console.log(`Command list: ${Object.values(CommandName)}\nTo get help on a command: ${helpCmld?.example}`);
                break;
            }
            const cmdToGiveHelp = availableCmds.find(cmd => cmd.name === input.getArg(0));
            console.log(cmdToGiveHelp?.example);
        }
    }
}

const cli = new CLI();
cli.onLineListener(onNewLine);
cli.onCloseListener(() => console.log('\nHave a great day!'));
cli.start(() => console.log('Welcome to the task-tracker CLI!'));
