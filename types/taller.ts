export interface Taller {
  id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  descripcion?: string;
  logo?: string;
}

export interface UserWithTaller {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  taller?: Taller;
}