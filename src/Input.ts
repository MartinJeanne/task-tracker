import InputError from "./error/InputError";

export type Command = {
    name: string;
    argsMin: number;
    argsMax: number;
    example: string;
}

export default class Input {
    private static commandTypes: Command[] = [
        { name: 'list', argsMin: 0, argsMax: 1, example: 'list (:status)' },
        { name: 'add', argsMin: 1, argsMax: 1, example: 'add :name' },
        { name: 'update', argsMin: 2, argsMax: 2, example: 'update :id :newName' },
        { name: 'mark', argsMin: 2, argsMax: 2, example: 'mark :id :newStatus' },
        { name: 'delete', argsMin: 1, argsMax: 1, example: 'delete :id' }
    ]

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

        const command = Input.commandTypes.filter(cmd => cmd.name === lineArray[0]);

        if (command.length === 0) {
            const cmdNames = Input.commandTypes.map(cmd => cmd.name)
            throw new InputError(`Invalid command: ${lineArray[0]}\nPossible commands: ${cmdNames}`);
        } else if (command.length > 1) {
            throw new InputError(`Internal error, multiple CommandTypes found for command: "${lineArray[0]}"`);
        }

        this.command = command[0];
        const min = this.command.argsMin;
        const max = this.command.argsMax;

        const args = lineArray.slice(1, lineArray.length);
        if (args.length < min || args.length > max) {
            throw new InputError(`Invalid args numbers, got: ${args.length} exepected min: ${min}, max: ${max}\n${this.command.example}`);
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
