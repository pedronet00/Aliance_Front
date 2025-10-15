export type AccountReceivable = {
    id: number,
    guid: string,
    description: string,
    amount: number,
    dueDate: Date,
    paymentDate: Date,
    accountStatus: string,
    costCenterId: number,
    costCenterName: string
}