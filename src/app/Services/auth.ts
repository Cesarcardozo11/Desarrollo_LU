// interface = describe la FORMA de un objeto: qué campos tiene y de qué tipo.
// No crea nada; solo le dice a TypeScript cómo deben verse los datos.
// string = texto | number = número | boolean = true/false
// El signo ? = el campo es opcional (puede no venir)

// Lo que se envía para iniciar sesión
export interface LoginRequest {
  email: string;
  password: string;
}

// Lo que se envía para registrarse
export interface RegistroRequest {
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  email: string;
  password: string;
}

// Lo que responde el backend al iniciar sesión o registrarse
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

// El usuario que devuelve el backend (nunca trae la contraseña)
export interface AuthUser {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  edad?: number;
  sexo?: string;
  fecha_creacion?: Date;
}
