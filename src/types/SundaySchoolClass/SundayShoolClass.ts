export type SundaySchoolClass = {
  id: number;
  guid: string;

  lesson: string;
  teacherId: string;
  teacherName?: string;

  sundaySchoolClassroomId: number;
  sundaySchoolClassroomName?: string;
};
