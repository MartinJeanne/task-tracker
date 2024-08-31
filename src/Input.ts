import InputError from "./error/InputError";
import { CommandName } from "./types";

export type Command = {
    name: CommandName;
    argsMin: number;
    argsMax: number;
    example: string;
}

export default class Input {
    private static availableCommands: Command[] = [
        { name: CommandName.list, argsMin: 0, argsMax: 1, example: `${CommandName.list} (:status)` },
        { name: CommandName.add, argsMin: 1, argsMax: 1, example: `${CommandName.add} :name` },
        { name: CommandName.update, argsMin: 2, argsMax: 2, example: `${CommandName.update} :id :newName` },
        { name: CommandName.mark, argsMin: 2, argsMax: 2, example: `${CommandName.mark} :id :newStatus` },
        { name: CommandName.delete, argsMin: 1, argsMax: 1, example: `${CommandName.delete} :id` }
    ];

    private command: Command;
    private args: string[];

    constructor(line: string) {
        const lineArray: string[] = [];
        const regex = /"(.*?)"|(\S+)/g;
        let match;

        while ((match = regex.exec(line)) !== null) {
            lineArray.push(match[1] || match[2]);
        }

        if (!lineArray || lineArray.length < 1)
            throw new InputError('No command passed.');

        const commandName = lineArray[0] as CommandName;
        if (!Object.values(CommandName).includes(commandName))
            throw new InputError(`Unknow command: ${commandName}\nPossible commands: ${CommandName}`);

        const command = Input.availableCommands.find(cmd => cmd.name === commandName);
        if (!command)
            throw new InputError(`Internal error: command name found in commandName enum but not in commandTypes array`);

        this.command = command;
        const min = this.command.argsMin;
        const max = this.command.argsMax;

        const args = lineArray.slice(1, lineArray.length);
        if (args.length < min || args.length > max) {
            throw new InputError(`Invalid args numbers, got: ${args.length}, exepected min: ${min}, max: ${max}\n${this.command.example}`);
        }

        this.args = args;
    }

    getCmd(): Command {
        return this.command;
    }

    getCmdName(): string {
        return this.command.name;
    }

    getArgs(): string[] {
        return this.args;
    }

    getArg(index: number): string {
        return this.args[index];
    }
}
