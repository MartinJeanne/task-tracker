import { Status, UNDEFINED_ID } from "./types";

export default class Task {
    private id: number;
    private name: string;
    private description: string;
    private status: Status;

    constructor(name: string, description = '', status = Status.todo, id?: number) {
        if (id) this.id = id;
        else this.id = UNDEFINED_ID;
        this.name = name;
        this.description = description;
        this.status = status;
    }

    getId() {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    setName(name: string) {
        this.name = name;
    }

    getStatus() {
        return this.status;
    }

    static isStatus(status: string): status is Status {
        const s = status as Status;
        return Object.values(Status).includes(s)
    }

    setSatus(status: Status) {
        this.status = status;
    }

    toString(): string {
        return `${this.id}. ${this.status}: "${this.name}"`;
    }

    toStringDetails(): string {
        return `${this.id}. ${this.status}: "${this.name}" - ${this.description}`;
    }
}
