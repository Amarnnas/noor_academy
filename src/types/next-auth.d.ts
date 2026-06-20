import type { UserRole, RolePermission } from "@/types/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      permissions: RolePermission[];
    };
  }

  interface User {
    role: UserRole;
    permissions: RolePermission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    permissions: RolePermission[];
  }
}
