export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    phone: number;
    password: string;
    //photo: blob;
    creditExpiration: Date;
}
export interface Role {
    id: number;
    name: string;
}