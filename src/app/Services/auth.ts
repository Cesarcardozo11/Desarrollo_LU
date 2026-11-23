export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export interface AuthUser {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  edad?: number;
  sexo?: string;
  fecha_creacion?: Date;
}
