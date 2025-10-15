export type AccountReceivableDTO = {
    description: string,
    amount: number,
    dueDate: Date,
    paymentDate: Date,
    accountStatus: string,
    costCenterId: number
}