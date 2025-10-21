
// lib/authOptions.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { Role, users } from "@prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { emailOrUsername, password } = credentials;

        const user = await prisma.users.findFirst({
          where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
          },
        });

        if (!user) return null;

        const isValid = await compare(password, user.password_hash);
        if (!isValid) return null;

        return {
          id: user.id,
          role: user.role,
          full_name: user.full_name,
          email: user.email,
          username: user.username,
          phone: user.phone ?? undefined,
          image: user.profile_image_url ?? undefined,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.full_name = user.full_name;
        token.username = user.username;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
      }

      // optional: refresh token with DB data
      if (token.id) {
        const dbUser = await prisma.users.findUnique({ where: { id: token.id } });
        if (dbUser) {
          token.full_name = dbUser.full_name;
          token.username = dbUser.username;
          token.email = dbUser.email;
          token.phone = dbUser.phone ?? undefined;
          token.image = dbUser.profile_image_url ?? undefined;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        role: token.role as Role,
        full_name: token.full_name as string,
        username: token.username as string,
        email: token.email as string,
        phone: token.phone as string | undefined,
        image: token.image as string | undefined,
      };
      return session;
    },
  },

  pages: { signIn: "/" },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
