import { SimpleAccount } from "./account";

export class Role {
    id: string;
    name: string;
    description: string;
    total: number;
    pages: number;
    current: number;
    size: number;
    associatedUsers: SimpleAccount[];
}
export class SimpleRole {
    name: string;
    description?: string;
    id: string;
}
