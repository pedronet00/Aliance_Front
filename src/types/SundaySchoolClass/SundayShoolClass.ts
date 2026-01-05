export type SundaySchoolClass = {
  id: number;
  guid: string;
  date: Date;
  lesson: string;
  teacherId: string;
  teacherName?: string;

  sundaySchoolClassroomId: number;
  sundaySchoolClassroomName?: string;
};
