export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone: number;
  password: string;
  dni: number;
  //photo: blob;
}

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}
