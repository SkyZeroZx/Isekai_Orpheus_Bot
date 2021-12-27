export interface User{
    username: string;
    password: string;
}

export interface ChangePassword{
    oldPassword:string;
    newPassword:string;
}

export type Roles = 'admin' | 'tramitador'
export interface UserResponse {
    message : string;
    token: string;
    userId : number;
    role: Roles;
}

export interface ChangePasswordRes {
    message : string;
}