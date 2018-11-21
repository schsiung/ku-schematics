export class Operation {
    code: string;
    name: string;
}
export class OperationList {
    size: number;
    pages: number;
    total: number;
    current: number;
    records: Operation[];
}
