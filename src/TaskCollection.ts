import fs from 'node:fs/promises';
import Task from "./Task";
import { Status } from './types';
import JSONParseError from './error/JSONParseError';

type TaskRaw = {
    id: number,
    name: string,
    description: string,
    status: Status
}

export default class TaskCollection {
    private static _instance: TaskCollection;
    private path: string = './tasks.json';

    private constructor() { }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    async getTasks(): Promise<Task[]> {
        const tasks = await fs.readFile(this.path, { encoding: 'utf8' })
            .then(json => JSON.parse(json))
            .catch(async e => {
                if (e.code === 'ENOENT') {
                    await this.setTasks([]);
                    return [];
                }
                else console.error(e);
            });

        if (!this.isTasksRaw(tasks)) {
            throw new JSONParseError('Invalid data: array of Task expected from JSON')
        }
        return this.instantiateTasks(tasks);
    }

    async setTasks(tasks: Task[]) {
        const json = JSON.stringify(tasks);
        await fs.writeFile(this.path, json, { encoding: 'utf8' });
    }

    async nextValidId(): Promise<number> {
        const tasks = await this.getTasks();
        if (!tasks || tasks.length === 0) return 1;
        
        const sortedTasks = tasks.sort((a, b) => b.getId() - a.getId())
        return sortedTasks[0].getId() + 1;
    }

    private isTaskRaw(value: unknown): value is TaskRaw {
        if (!value || typeof value !== 'object') {
            return false
        }
        const object = value as Record<string, unknown>

        return (
            typeof object.id === 'number' &&
            typeof object.name === 'string' &&
            typeof object.description === 'string' &&
            Object.values(Status).includes(object.status as Status)
        )
    }

    private isTasksRaw(value: unknown): value is TaskRaw[] {
        return Array.isArray(value) && value.every(this.isTaskRaw)
    }

    private instantiateTask(tr: TaskRaw): Task {
        return new Task(tr.id, tr.name, tr.description, tr.status);
    }

    private instantiateTasks(trs: TaskRaw[]): Task[] {
        return trs.map(tr => this.instantiateTask(tr));
    }

    //get last id?
}
