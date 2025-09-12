

import NextAuth from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      full_name: string;
      email: string;
      image?: string; // optional string, undefined allowed
    };
  }

  interface User {
    id: string;
    role: Role;
    full_name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    full_name: string;
    email?: string;
    image?: string;
  }
}
