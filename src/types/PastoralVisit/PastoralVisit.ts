export type PastoralVisit = {
    id: number;
    guid: string;
    visitDate: Date;
    description: string;
    visitedMemberId: string;
    pastorId: string;
    status: string;
    churchId: number;
}