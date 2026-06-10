import type { UserRole, RolePermission } from "@/types/roles";
import { ROLE_PERMISSIONS } from "@/types/roles";

export const PERMISSION_LABELS: Record<RolePermission, string> = {
  view_dashboard: "عرض لوحة التحكم",
  manage_courses: "إدارة الدورات",
  manage_instructors: "إدارة المدربين",
  manage_testimonials: "إدارة آراء الطلاب",
  manage_orders: "إدارة الطلبات",
  manage_messages: "إدارة الرسائل",
  manage_certificates: "إدارة الشهادات",
  manage_admins: "إدارة المشرفين",
  manage_students: "إدارة الطلاب",
  view_student_portal: "بوابة الطالب",
  view_admin_dashboard: "لوحة المشرف",
};

export const ALL_PERMISSIONS: RolePermission[] = [
  "manage_admins",
  "manage_courses",
  "manage_instructors",
  "manage_testimonials",
  "manage_orders",
  "manage_messages",
  "manage_certificates",
  "manage_students",
];

export const DEFAULT_ADMIN_PERMISSIONS: RolePermission[] = [
  "manage_courses",
  "manage_instructors",
  "manage_testimonials",
  "manage_orders",
  "manage_messages",
  "manage_certificates",
];

export function getRolePermissions(role: UserRole): RolePermission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role: UserRole | undefined, permission: RolePermission): boolean {
  if (!role) return false;
  return getRolePermissions(role).includes(permission);
}

export function hasSpecificPermission(userPermissions: string[] | undefined, required: string): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(required);
}
