import readline from 'node:readline';

export default class CLI {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'task-cli ',
        });
    }

    start() {
        console.log('Welcome to the task-tracker CLI!');
        this.rl.prompt();
    }

    onLineListener(callback: (line: string) => Promise<void>) {
        this.rl.on('line', async (line: string) => {
            await callback(line);
            this.rl.prompt();
        });
    }

    onCloseListener() {
        this.rl.on('close', () => {
            console.log('\nHave a great day!');
            process.exit(0);
        });
    }
}
