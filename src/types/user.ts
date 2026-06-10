import type { UserRole, RolePermission } from "./roles";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions?: RolePermission[];
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Order {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  status: "pending" | "confirmed" | "cancelled";
  paid: boolean;
  createdAt: string;
}
