export interface UserLogin {
  username: string;
  password: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

export type Roles = "admin" | "tramitador";
export interface UserResponse {
  username?: string;
  message?: string;
  token?: string;
  userId?: number;
  role?: Roles;
  firstLogin?: boolean;
}

export interface UserUpdate {
  apellidoMaterno: string;
  apellidoPaterno: string;
  estado: string;
  role : Roles;
  nombre: string;
  username: string;
  id? : number;
}

export interface ChangePasswordRes {
  message: string;
}

export interface UserReport{
  id: number;
  username: string;
  role: Roles;
  createdAt: string;
  updateAt: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estado: string;
}
