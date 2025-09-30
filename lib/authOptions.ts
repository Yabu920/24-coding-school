// // lib/authOptions.ts

// import NextAuth, { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";
// import { Role, users } from "@prisma/client";

// declare module "next-auth" {
//   interface User {
//     id: string;
//     role: Role;
//     full_name: string;
//     email: string;
//     username: string;
//     phone?: string;
//     image?: string;
//   }
//   interface Session {
//     user: {
//       id: string;
//       role: Role;
//       full_name: string;
//       email: string;
//       username: string;
//       phone?: string;
//       image?: string;
//     };
//   }
// }

// export const authOptions: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         emailOrUsername: { label: "Email or Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const { emailOrUsername, password } = credentials;

//         const user: users | null = await prisma.users.findFirst({
//           where: {
//             OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
//           },
//         });

//         if (!user) return null;

//         const isValid = await compare(password, user.password_hash);
//         if (!isValid) return null;

//         return {
//           id: user.id,
//           role: user.role,
//           full_name: user.full_name,
//           email: user.email,
//           username: user.username, 
//           phone: user.phone ?? undefined,
//           image: user.profile_image_url ?? undefined,
//         };
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.full_name = user.full_name;
//         token.username = user.username;
//         token.email = user.email;
//         token.phone = user.phone ?? undefined;
//         token.image = user.image;
//      }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.role = token.role;
//       session.user.full_name = token.full_name;
//       session.user.email = token.email ?? "";
//       session.user.username = typeof token.username === "string" ? token.username : "";
//       session.user.phone = typeof token.phone === "string" ? token.phone : undefined;
//       session.user.image = typeof token.image === "string" ? token.image : undefined;
//       return session;
//     },
//   },
//   pages: { signIn: "/login" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// // lib/authOptions.ts
// import NextAuth, { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";
// import { Role, users } from "@prisma/client";

// declare module "next-auth" {
//   interface User {
//     id: string;
//     role: Role;
//     full_name: string;
//     email: string;
//     username: string;
//     phone?: string;
//     image?: string;
//   }
//   interface Session {
//     user: {
//       id: string;
//       role: Role;
//       full_name: string;
//       email: string;
//       username: string;
//       phone?: string;
//       image?: string;
//     };
//   }
// }

// export const authOptions: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         emailOrUsername: { label: "Email or Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const { emailOrUsername, password } = credentials;

//         const user: users | null = await prisma.users.findFirst({
//           where: {
//             OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
//           },
//         });

//         if (!user) return null;

//         const isValid = await compare(password, user.password_hash);
//         if (!isValid) return null;

//         return {
//           id: user.id,
//           role: user.role,
//           full_name: user.full_name,
//           email: user.email,
//           username: user.username,
//           phone: user.phone ?? undefined,
//           image: user.profile_image_url ?? undefined,
//         };
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   callbacks: {
//     async jwt({ token, user }) {
//       // On login, attach user info
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.full_name = user.full_name;
//         token.username = user.username;
//         token.email = user.email;
//         token.phone = user.phone ?? undefined;
//         token.image = user.image;
//       }

//       // Always fetch fresh user data from DB
//       if (token.id) {
//         const dbUser = await prisma.users.findUnique({
//           where: { id: token.id as string },
//         });
//         if (dbUser) {
//           token.full_name = dbUser.full_name;
//           token.username = dbUser.username;
//           token.email = dbUser.email;
//           token.phone = dbUser.phone ?? undefined;
//           token.image = dbUser.profile_image_url ?? undefined;
//         }
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id as string;
//       session.user.role = token.role as Role;
//       session.user.full_name = token.full_name as string;
//       session.user.email = (token.email as string) ?? "";
//       session.user.username = (token.username as string) ?? "";
//       session.user.phone = typeof token.phone === "string" ? token.phone : undefined;
//       session.user.image = typeof token.image === "string" ? token.image : undefined;
//       return session;
//     },
//   },
//   pages: { signIn: "/login" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



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

  pages: { signIn: "/login" },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
