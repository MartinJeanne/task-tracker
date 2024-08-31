import { Status } from "./types";

export default class Task {
    private id: number;
    private name: string;
    private description: string;
    private status: Status;

    constructor(id: number, name: string, description = '', status = Status.todo) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
    }

    getId() {
        return this.id;
    }

    getStatus() {
        return this.status;
    }

    toString(): string {
        return `${this.id}. ${this.status}: "${this.name}"`;
    }

    toStringDetails(): string {
        return `${this.id}. ${this.status}: "${this.name}" - ${this.description}`;
    }
}
