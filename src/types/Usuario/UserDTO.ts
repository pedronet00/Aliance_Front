export type UserDTO = {
  id?: string;
  fullName: string;
  userName?: string; // Optional if existing code expects it
  email: string;
  password?: string;
  role: string;
  phoneNumber: string;
  status: boolean;
  admissionDate?: string | Date; // ISO string typically
  admissionType?: number; // assuming it maps to a number (enum)
  imageUrl?: string;
  image?: File | null;
  cpf?: string;
  rg?: string;
  fathersName?: string;
  mothersName?: string;
  profession?: string;
  education?: string;
  gender: boolean;
  maritalStatus?: string;
  cep?: string;
  streetAdress?: string;
  streetNumber?: number;
  streetComplement?: string;
  streetNeighborhood?: string;
  currentCity?: string;
  state?: string;
  previousReligion?: string;
  baptismDate?: string | Date;
  baptismChurch?: string;
  baptismPastor?: string;
  professionOfFaithDate?: string | Date;
  professionOfFaithChurch?: string;
  professionOfFaithPastor?: string;
  churchId: number;
};