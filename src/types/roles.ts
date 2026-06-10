export type UserRole = "student" | "teacher" | "admin";

export const ROLES: UserRole[] = ["student", "teacher", "admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "طالب",
  teacher: "مدرب",
  admin: "مشرف",
};

export type RolePermission =
  | "view_dashboard"
  | "manage_courses"
  | "manage_instructors"
  | "manage_testimonials"
  | "manage_orders"
  | "manage_messages"
  | "manage_certificates"
  | "manage_admins"
  | "manage_students"
  | "view_student_portal"
  | "view_admin_dashboard";

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission[]> = {
  student: ["view_student_portal"],
  teacher: ["view_student_portal", "view_dashboard", "manage_courses", "manage_testimonials"],
  admin: [
    "view_admin_dashboard",
    "view_dashboard",
    "manage_courses",
    "manage_instructors",
    "manage_testimonials",
    "manage_orders",
    "manage_messages",
    "manage_certificates",
    "manage_admins",
    "manage_students",
  ],
};

export const ROLE_ROUTES: Record<UserRole, string> = {
  student: "/portal",
  teacher: "/dashboard",
  admin: "/dashboard",
};
