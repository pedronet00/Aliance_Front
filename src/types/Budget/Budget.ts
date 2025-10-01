export type Budget = {
    id: string;
    guid: string;
    name: string;
    description: string;
    totalAmount: number;
    startDate: Date;
    endDate: Date;
    status: string;
    costCenterId: number;
    costCenterName: string;
}