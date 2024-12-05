export interface UserModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: Role;
    phone?: string;
    dni: string;
    picture?: URL;
    streak?: number;
}

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  KINE = 'KINE'
}

export interface BodyPart {
  id: number;
  name: string;
}

export interface KineModel extends UserModel {
  bodyParts: number[];
}
