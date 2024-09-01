import { Status, UNDEFINED_ID } from "./types";

export default class Task {
    private id: number;
    private description: string;
    private status: Status;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(description: string, status = Status.todo, id?: number, createdAt?: Date, updatedAt?: Date) {
        if (id) this.id = id;
        else this.id = UNDEFINED_ID;
        this.description = description;
        this.status = status;

        if (createdAt) this.createdAt = createdAt;
        else this.createdAt = new Date();
        if (updatedAt) this.updatedAt = updatedAt;
        else this.updatedAt = new Date();
    }

    getId() {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    setDescription(description: string) {
        this.description = description;
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

    setUpdatedAt(date: Date) {
        this.updatedAt = date;
    }

    toString(): string {
        return `${this.id}. ${this.status}: "${this.description}"`;
    }

    toStringDetail(): string {
        return `${this.id}. ${this.status}: "${this.description}" - created: ${this.createdAt}, updated: ${this.updatedAt}`;
    }
}
