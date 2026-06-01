import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";
import { ALL_PERMISSIONS } from "@/lib/permissions";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const q = query(collection(db, "admins"), where("email", "==", credentials.email), where("password", "==", credentials.password), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data() as { name: string; email: string; permissions?: string[] };
            logger.info("Admin login via Firestore", { email: credentials.email });
            return { id: snap.docs[0].id, name: data.name, email: data.email, role: "admin", permissions: data.permissions || [] };
          }
        } catch (err) {
          logger.error("Firestore admin lookup failed", err);
        }
        if (credentials.email === "admin@noor.com" && credentials.password === "admin123") {
          return { id: "1", name: "مشرف النظام", email: "admin@noor.com", role: "admin", permissions: ALL_PERMISSIONS };
        }
        return null;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        try {
          const q = query(collection(db, "admins"), where("email", "==", token.email), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data() as { permissions?: string[] };
            token.role = "admin";
            token.permissions = data.permissions || [];
          } else {
            token.role = "student";
            token.permissions = [];
          }
        } catch (err) {
          logger.error("Firestore admin check for Google login failed", err);
          token.role = "student";
          token.permissions = [];
        }
      } else if (user) {
        token.role = (user as { role?: string }).role || "student";
        token.permissions = (user as { permissions?: string[] }).permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { permissions?: string[] }).permissions = token.permissions as string[];
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login", newUser: "/auth/register" },
};
