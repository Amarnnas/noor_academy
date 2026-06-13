import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { logger } from "@/lib/logger";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";
import { getAdminByEmail, getTeacherByEmail, getStudentByEmail } from "@/lib/firestore-admin";
import { verifyPassword } from "@/lib/password";
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

        if (adminAuthIsConfigured()) {
          try {
            const adminData = await getAdminByEmail(credentials.email);
            if (adminData?.password) {
              const valid = await verifyPassword(credentials.password, adminData.password);
              if (valid) {
                logger.info("Admin login via Admin SDK", { email: credentials.email });
                return {
                  id: adminData.id,
                  name: adminData.name,
                  email: adminData.email,
                  role: adminData.role || "admin",
                  permissions: adminData.permissions || ALL_ROLE_PERMISSIONS.admin,
                };
              }
            }

            const teacherData = await getTeacherByEmail(credentials.email);
            if (teacherData?.password) {
              const valid = await verifyPassword(credentials.password, teacherData.password);
              if (valid) {
                logger.info("Teacher login via Admin SDK", { email: credentials.email });
                return {
                  id: teacherData.id,
                  name: teacherData.name,
                  email: teacherData.email,
                  role: "teacher" as UserRole,
                  permissions: ALL_ROLE_PERMISSIONS.teacher,
                };
              }
            }

            const studentData = await getStudentByEmail(credentials.email);
            if (studentData?.password) {
              const valid = await verifyPassword(credentials.password, studentData.password);
              if (valid) {
                logger.info("Student login via Admin SDK", { email: credentials.email });
                return {
                  id: studentData.id,
                  name: studentData.name,
                  email: studentData.email,
                  role: "student" as UserRole,
                  permissions: ALL_ROLE_PERMISSIONS.student,
                };
              }
            }
          } catch (err) {
            logger.error("Admin SDK lookup failed", err);
          }
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
        if (adminAuthIsConfigured()) {
          try {
            const adminData = await getAdminByEmail(token.email || "");
            if (adminData) {
              token.role = "admin";
              token.permissions = ALL_ROLE_PERMISSIONS.admin;
            } else {
              const teacherData = await getTeacherByEmail(token.email || "");
              if (teacherData) {
                token.role = "teacher";
                token.permissions = ALL_ROLE_PERMISSIONS.teacher;
              } else {
                token.role = "student";
                token.permissions = ALL_ROLE_PERMISSIONS.student;
              }
            }
          } catch (err) {
            logger.error("Admin SDK role lookup for Google login failed", err);
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
        (session.user as { role?: UserRole }).role = (token.role as UserRole) || "student";
        (session.user as { permissions?: RolePermission[] }).permissions = (token.permissions as RolePermission[]) || [];
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login", newUser: "/auth/register" },
};
