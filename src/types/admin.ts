export type AdminPermission =
  | "manage_admins"
  | "manage_courses"
  | "manage_instructors"
  | "manage_testimonials"
  | "manage_orders"
  | "manage_messages"
  | "manage_certificates";

export interface Admin {
  id: string;
  name: string;
  email: string;
  password?: string;
  permissions: AdminPermission[];
  createdAt: string;
}
