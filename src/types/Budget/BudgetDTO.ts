export type BudgetDTO = {
    name: string;
    description: string;
    totalAmount: number;
    startDate: Date;
    endDate: Date;
    status: string;
    costCenterId: number;
    churchId: number;
}