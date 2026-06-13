import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { getUserByEmail } from "@/lib/user-store";
import { logger } from "@/lib/logger";
import type { UserRole, RolePermission } from "@/types/roles";
import { ROLE_PERMISSIONS } from "@/types/roles";

const ALL_ROLE_PERMISSIONS = ROLE_PERMISSIONS;

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

        if (isFirebaseConfigured()) {
          try {
            const adminsQuery = query(collection(db, "admins"), where("email", "==", credentials.email), limit(1));
            const adminsSnap = await getDocs(adminsQuery);
            if (!adminsSnap.empty) {
              const data = adminsSnap.docs[0].data() as { name: string; email: string; password?: string; role?: UserRole; permissions?: RolePermission[] };
              const passwordValid = data.password ? credentials.password === data.password : false;
              if (passwordValid) {
                logger.info("Admin login via Firestore", { email: credentials.email });
                return {
                  id: adminsSnap.docs[0].id,
                  name: data.name,
                  email: data.email,
                  role: data.role || "admin",
                  permissions: data.permissions || ALL_ROLE_PERMISSIONS.admin,
                };
              }
            }

            const teachersQuery = query(collection(db, "teachers"), where("email", "==", credentials.email), limit(1));
            const teachersSnap = await getDocs(teachersQuery);
            if (!teachersSnap.empty) {
              const data = teachersSnap.docs[0].data() as { name: string; email: string; password?: string };
              const passwordValid = data.password ? credentials.password === data.password : false;
              if (passwordValid) {
                logger.info("Teacher login via Firestore", { email: credentials.email });
                return {
                  id: teachersSnap.docs[0].id,
                  name: data.name,
                  email: data.email,
                  role: "teacher" as UserRole,
                  permissions: ALL_ROLE_PERMISSIONS.teacher,
                };
              }
            }

            const studentsQuery = query(collection(db, "students"), where("email", "==", credentials.email), limit(1));
            const studentsSnap = await getDocs(studentsQuery);
            if (!studentsSnap.empty) {
              const data = studentsSnap.docs[0].data() as { name: string; email: string; password?: string };
              const passwordValid = data.password ? credentials.password === data.password : false;
              if (passwordValid) {
                logger.info("Student login via Firestore", { email: credentials.email });
                return {
                  id: studentsSnap.docs[0].id,
                  name: data.name,
                  email: data.email,
                  role: "student" as UserRole,
                  permissions: ALL_ROLE_PERMISSIONS.student,
                };
              }
            }
          } catch (err) {
            logger.error("Firestore lookup failed", err);
          }
        }

        const registeredUser = getUserByEmail(credentials.email);
        if (registeredUser && credentials.password === registeredUser.password) {
          logger.info("Student login (registered)", { email: credentials.email });
          return { id: registeredUser.email, name: registeredUser.name, email: registeredUser.email, role: "student", permissions: ALL_ROLE_PERMISSIONS.student };
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
        if (isFirebaseConfigured()) {
          try {
            const adminsQuery = query(collection(db, "admins"), where("email", "==", token.email), limit(1));
            const adminsSnap = await getDocs(adminsQuery);
            if (!adminsSnap.empty) {
              token.role = "admin";
              token.permissions = ALL_ROLE_PERMISSIONS.admin;
            } else {
              const teachersQuery = query(collection(db, "teachers"), where("email", "==", token.email), limit(1));
              const teachersSnap = await getDocs(teachersQuery);
              if (!teachersSnap.empty) {
                token.role = "teacher";
                token.permissions = ALL_ROLE_PERMISSIONS.teacher;
              } else {
                token.role = "student";
                token.permissions = ALL_ROLE_PERMISSIONS.student;
              }
            }
          } catch (err) {
            logger.error("Firestore role lookup for Google login failed", err);
            token.role = "student";
            token.permissions = ALL_ROLE_PERMISSIONS.student;
          }
        } else {
          token.role = "student";
          token.permissions = ALL_ROLE_PERMISSIONS.student;
        }
      } else if (user) {
        token.role = (user as { role?: UserRole }).role || "student";
        token.permissions = (user as { permissions?: RolePermission[] }).permissions || ALL_ROLE_PERMISSIONS.student;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: UserRole }).role = token.role as UserRole;
        (session.user as { permissions?: RolePermission[] }).permissions = token.permissions as RolePermission[];
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login", newUser: "/auth/register" },
};
