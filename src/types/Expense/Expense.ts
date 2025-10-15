export type Expense = {
    id: number;
    guid: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
    accountReceivableId?: number;
}