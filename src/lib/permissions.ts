import type { AdminPermission } from "@/types/admin";

export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  manage_admins: "إدارة المشرفين",
  manage_courses: "إدارة الدورات",
  manage_instructors: "إدارة المدربين",
  manage_testimonials: "إدارة آراء الطلاب",
  manage_orders: "إدارة الطلبات",
  manage_messages: "إدارة الرسائل",
  manage_certificates: "إدارة الشهادات",
};

export const ALL_PERMISSIONS: AdminPermission[] = [
  "manage_admins",
  "manage_courses",
  "manage_instructors",
  "manage_testimonials",
  "manage_orders",
  "manage_messages",
  "manage_certificates",
];

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermission[] = [
  "manage_courses",
  "manage_instructors",
  "manage_testimonials",
  "manage_orders",
  "manage_messages",
  "manage_certificates",
];

export function hasPermission(userPermissions: string[] | undefined, required: AdminPermission): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(required);
}
