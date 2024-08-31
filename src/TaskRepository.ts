import fs from 'node:fs/promises';
import Task from "./Task";
import { Status, UNDEFINED_ID } from './types';
import JSONParseError from './error/JSONParseError';

type RawTask = {
    id: number,
    description: string,
    status: Status,
    createdAt: string,
    updatedAt: string
}

export default class TaskRepository {
    private path: string = './tasks.json';

    constructor() { }

    async findAll(): Promise<Task[]> {
        const tasksRaw = await fs.readFile(this.path, { encoding: 'utf8' })
            .then(json => JSON.parse(json))
            .catch(async e => {
                if (e.code === 'ENOENT') {
                    await this.overwriteAll([]);
                    return [];
                }
                else console.error(e);
            });

        if (!this.isTasksRaw(tasksRaw)) {
            throw new JSONParseError('Invalid data: array of Task expected from JSON')
        }
        const tasks = this.toTasks(tasksRaw);
        return tasks.sort((a, b) => a.getId() - b.getId());
    }

    async findById(id: number): Promise<Task | undefined> {
        const tasks = await this.findAll();
        return tasks.find(t => t.getId() === id);
    }

    async save(task: Task) {
        const tasks = await this.findAll();
        if (task.getId() === UNDEFINED_ID)
            task.setId(this.nextValidId(tasks));
        else {
            const toUpdate = tasks.find(t => t.getId() === task.getId());
            if (toUpdate) tasks.splice(tasks.indexOf(toUpdate), 1);
        }
        tasks.push(task);
        await this.overwriteAll(tasks);
    }

    async delete(task: Task) {
        const tasks = await this.findAll();
        const toDelete = tasks.find(t => t.getId() === task.getId());
        if (toDelete) {
            tasks.splice(tasks.indexOf(toDelete), 1);
            await this.overwriteAll(tasks);
        }
    }

    private nextValidId(tasks: Task[]): number {
        if (!tasks || tasks.length === 0) return 1;

        const sortedTasks = tasks.sort((a, b) => b.getId() - a.getId())
        return sortedTasks[0].getId() + 1;
    }

    private async overwriteAll(tasks: Task[]) {
        const json = JSON.stringify(tasks);
        await fs.writeFile(this.path, json, { encoding: 'utf8' });
    }

    private isTaskRaw(value: unknown): value is RawTask {
        if (!value || typeof value !== 'object') {
            return false
        }
        const object = value as Record<string, unknown>

        return (
            typeof object.id === 'number' &&
            typeof object.description === 'string' &&
            Object.values(Status).includes(object.status as Status) &&
            typeof object.createdAt === 'string' && !isNaN(Date.parse(object.createdAt)) &&
            typeof object.updatedAt === 'string' && !isNaN(Date.parse(object.updatedAt))
        )
    }

    private isTasksRaw(value: unknown): value is RawTask[] {
        return Array.isArray(value) && value.every(this.isTaskRaw)
    }

    private toTask(rTask: RawTask): Task {
        return new Task(rTask.description, rTask.status, rTask.id, new Date(rTask.createdAt), new Date(rTask.updatedAt));
    }

    private toTasks(rTasks: RawTask[]): Task[] {
        return rTasks.map(tr => this.toTask(tr));
    }
}
