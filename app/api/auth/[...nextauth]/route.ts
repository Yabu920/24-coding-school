

// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { Role } from "@prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { emailOrUsername, password, role } = credentials;

        const wantedRole = (role ?? "").toLowerCase() as Role;

        const userRecord = await prisma.users.findFirst({
          where: {
            role: wantedRole,
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
          },
        });

        if (!userRecord) return null;

        const isValid = await compare(password, userRecord.password_hash);
        if (!isValid) return null;

        const safeUser = {
          id: userRecord.id,
          role: userRecord.role,
          name:
            userRecord.full_name?.trim() ||
            userRecord.username ||
            userRecord.email ||
            "User",
          email: userRecord.email,
          username: userRecord.username ?? "",
          phone: userRecord.phone ?? "",
          image: userRecord.profile_image_url ?? "",
        };

        return safeUser as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u: any = user;
        token.id = u.id;
        token.role = u.role;
        token.name = u.name;
        token.email = u.email;
        token.username = u.username ?? "";
        token.phone = u.phone ?? "";
        token.image = u.image ?? "";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.full_name = token.name as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string; // guaranteed string
        session.user.phone = token.phone as string; // guaranteed string
        session.user.image = token.image as string; // guaranteed string
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
