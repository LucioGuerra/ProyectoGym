export interface UserModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: Role;
    phone?: string;
    dni: string;
    picture?: URL;
}

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  KINE = 'KINE'
}
