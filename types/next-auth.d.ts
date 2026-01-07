import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      plan: string;
      taller?: {
        id: string;
        nombre: string;
        contacto?: string;
        telefono?: string;
        direccion?: string;
        email?: string;
        descripcion?: string;
        logo?: string;
      };
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    plan: string;
    taller?: {
      id: string;
      nombre: string;
      contacto: string;
      telefono?: string;
      direccion?: string;
      email?: string;
      descripcion?: string;
      logo?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    plan: string;
    taller?: {
      id: string;
      nombre: string;
      contacto?: string;
      telefono?: string;
      direccion?: string;
      email?: string;
      descripcion?: string;
      logo?: string;
    };
  }
}