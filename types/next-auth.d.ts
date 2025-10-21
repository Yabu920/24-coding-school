
// types/next-auth.d.ts
import NextAuth from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    full_name: string;
    email: string;
    username: string;
    phone?: string;
    image?: string;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      full_name: string;
      email: string;
      username: string;
      phone?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    full_name: string;
    email?: string;
    username?: string;
    phone?: string;
    image?: string;
  }
}
