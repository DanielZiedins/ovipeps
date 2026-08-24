import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import {
  activateOwnerAdmin,
  getOrMigrateOwnerAdmin,
  OWNER_EMAIL,
} from "./owner-account";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const user =
          email === OWNER_EMAIL
            ? await getOrMigrateOwnerAdmin()
            : await db.user.findUnique({ where: { email } });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!valid) return null;

        const authenticatedUser =
          email === OWNER_EMAIL && user.role !== "ADMIN"
            ? await activateOwnerAdmin(user.id)
            : user;

        return {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          name: `${authenticatedUser.firstName ?? ""} ${authenticatedUser.lastName ?? ""}`.trim(),
          role: authenticatedUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/account/login",
  },
  session: { strategy: "jwt" },
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

export async function requireAffiliate() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as { role?: string }).role !== "AFFILIATE") return null;
  return session;
}
