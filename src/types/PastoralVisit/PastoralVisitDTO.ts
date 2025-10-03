export interface PastoralVisitDTO {
  id?: number;
  guid?: string;
  visitDate: Date;
  description: string;
  visitedMemberId: string; // GUID
  pastorId: string;        // GUID
  status: string;
  churchId: number;
}
