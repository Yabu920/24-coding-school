
// import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";
// import { Role } from "@prisma/client";
// import { JWT } from "next-auth/jwt";
// import { NextRequest } from "next/server";

// // NextAuth options
// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         // Find user by email or username
//         const user = await prisma.users.findFirst({
//           where: {
//             OR: [{ email: credentials.email }, { username: credentials.email }],
//           },
//         });

//         if (!user) return null;

//         const isValid = await compare(credentials.password, user.password_hash);
//         if (!isValid) return null;

//         return {
//           id: user.id,
//           role: user.role as Role,
//           full_name: user.full_name,
//           email: user.email,
//           image: user.profile_image_url ?? undefined,
//         };
//       },
//     }),
//   ],

//   session: { strategy: "jwt" },

//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role as Role;
//         token.full_name = (user as any).full_name;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as Role;
//         session.user.full_name = token.full_name as string;
//       }
//       return session;
//     },
//   },

//   pages: { signIn: "/login" },
// };

// // ✅ App Router compatible route handlers
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };



// second update with less code

// import NextAuth, { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { compare } from "bcryptjs"
// import { prisma } from "@/lib/prisma" // make sure you have prisma client exported here
// import { Role } from "@prisma/client"

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         emailOrUsername: { label: "Email or Username", type: "text" },
//         password: { label: "Password", type: "password" },
//         role: { label: "Role", type: "text" }, // student | teacher | admin
//       },
//       async authorize(credentials) {
//         if (!credentials) return null

//         const { emailOrUsername, password, role } = credentials

//         const user = await prisma.users.findFirst({
//           where: {
//             role: role as any,
//             OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
//           },
//         })

//         if (!user) return null

//         const isValid = await compare(password, user.password_hash)
//         if (!isValid) return null

//         return {
//           id: user.id,
//           role: user.role,
//           full_name: user.full_name,
//           email: user.email,
//           image: user.profile_image_url ?? undefined,
//         }
//       },
//     }),
//   ],

//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET, // add this in .env

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.role = (user as any).role as Role;
//         token.full_name = (user as any).full_name
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//         session.user.role = token.role as Role
//         session.user.full_name = token.full_name as string
//       }
//       return session
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// }

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }






// // app/api/auth/[...nextauth]
// import NextAuth, { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { compare } from "bcryptjs";
// import { Role, users } from "@prisma/client";

// // Extend NextAuth session user type
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       role: Role;
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
//         role: { label: "Role", type: "text" },
//       },
//       async authorize(credentials): Promise<users | null> {
//         if (!credentials) return null;

//         const { emailOrUsername, password, role } = credentials;

//         // Find user matching role and email/username
//         const user: users | null = await prisma.users.findFirst({
//           where: {
//             role: role.toLowerCase() as Role,
//             OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
//           },
//         });

//         if (!user) return null;

//         // Verify password
//         const isValid = await compare(password, user.password_hash);
//         if (!isValid) return null;

//         // Return full Prisma user object
//         return user;
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.full_name;
//         token.email = user.email;
//         token.role = user.role;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//         session.user.role = token.role as Role;
//       }
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



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
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
