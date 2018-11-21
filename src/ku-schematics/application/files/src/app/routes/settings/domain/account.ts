export class Account {
    id: number;
    userName: string;
    displayName: string;
    roles?: Array<{ id: string; name: string; description?: string }>;
    status: number;
    attr?: Array<{ id: number; userId: string; key: string; value: string }>;
}
export class SimpleAccount {
    id: number;
    userName: string;
    displayName: string;
    status: number;
    attr?: Array<{ id: number; userId: string; key: string; value: string }>;
    //    [propName: string]: any;
}
export class UserList {
    size: number;
    current: number;
    total: number;
    pages: number;
    records: Account[];
}
export class Attr {
    id: number;
    userId: string;
    key: string;
    value: string;
}
