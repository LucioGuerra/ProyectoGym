export interface UserModel {
  id?: number;
  firstName: String;
  lastName: String;
  email: String;
  role?: Role;
  phone?: String;
  dni: String;
  picture?: URL;
  streak?: number;
}

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  KINE = 'KINE'
}
