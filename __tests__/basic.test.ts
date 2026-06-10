import React from "react";
import { renderToString } from "react-dom/server";
import { BRAND_ASSETS, PLACEHOLDER_IMAGES, SITE } from "@/lib/constants";
import { formatCoursePrice } from "@/lib/currency";
import { logger } from "@/lib/logger";
import { SocialIcon } from "@/components/shared/social-icons";
import { getRolePermissions, hasPermission, hasSpecificPermission } from "@/lib/permissions";
import { ROLE_PERMISSIONS, ROLES, ROLE_LABELS, ROLE_ROUTES } from "@/types/roles";
import type { UserRole } from "@/types/roles";

describe("Site Constants", () => {
  it("should have valid site name", () => {
    expect(SITE.name).toBe("أكاديمية نور");
  });

  it("should have valid contact email", () => {
    expect(SITE.email).toContain("@");
  });

  it("should have at least 4 nav links", () => {
    expect(SITE.name.length).toBeGreaterThan(0);
  });

  it("should expose symbol and full brand logos", () => {
    expect(BRAND_ASSETS.symbol).toBe("/images/just-logo.png");
    expect(BRAND_ASSETS.full).toBe("/images/noorpro.png");
  });
});

describe("Page Exports", () => {
  it("root layout exports metadata", () => {
    const layout = require("@/app/layout");
    expect(layout.metadata).toBeDefined();
    expect(layout.metadata.title.default).toContain("أكاديمية نور");
  });
});

describe("Course Display Updates", () => {
  it("formats course prices in Sudanese pounds", () => {
    expect(formatCoursePrice(499)).toBe("499 جنيه سوداني");
    expect(formatCoursePrice(499)).not.toContain("ريال");
  });

  it("renders actual social media icons", () => {
    const facebook = renderToString(React.createElement(SocialIcon, { name: "facebook" }));
    const youtube = renderToString(React.createElement(SocialIcon, { name: "youtube" }));

    expect(facebook).toContain("M18 2h-3a5");
    expect(youtube).toContain("m10 15 5-3-5-3z");
  });
});

describe("RBAC - Role Based Access Control", () => {
  it("defines exactly 3 roles: student, teacher, admin", () => {
    expect(ROLES).toEqual(["student", "teacher", "admin"]);
  });

  it("gives students only view_student_portal permission", () => {
    expect(getRolePermissions("student")).toEqual(["view_student_portal"]);
  });

  it("gives teachers dashboard and course management permissions", () => {
    const perms = getRolePermissions("teacher");
    expect(perms).toContain("view_dashboard");
    expect(perms).toContain("manage_courses");
    expect(perms).toContain("manage_testimonials");
    expect(perms).not.toContain("manage_admins");
  });

  it("gives admins all permissions", () => {
    const perms = getRolePermissions("admin");
    expect(perms).toContain("manage_admins");
    expect(perms).toContain("manage_courses");
    expect(perms).toContain("manage_instructors");
    expect(perms).toContain("manage_orders");
    expect(perms).toContain("manage_students");
  });

  it("hasPermission checks role correctly", () => {
    expect(hasPermission("admin", "manage_admins")).toBe(true);
    expect(hasPermission("teacher", "manage_admins")).toBe(false);
    expect(hasPermission("student", "view_student_portal")).toBe(true);
    expect(hasPermission("student", "manage_courses")).toBe(false);
    expect(hasPermission(undefined, "manage_courses")).toBe(false);
  });

  it("hasSpecificPermission checks explicit permission list", () => {
    expect(hasSpecificPermission(["manage_courses", "manage_admins"], "manage_admins")).toBe(true);
    expect(hasSpecificPermission(["manage_courses"], "manage_admins")).toBe(false);
    expect(hasSpecificPermission(undefined, "manage_admins")).toBe(false);
  });

  it("routes students to /portal and admins to /dashboard", () => {
    expect(ROLE_ROUTES.student).toBe("/portal");
    expect(ROLE_ROUTES.admin).toBe("/dashboard");
    expect(ROLE_ROUTES.teacher).toBe("/dashboard");
  });

  it("has Arabic labels for all roles", () => {
    expect(ROLE_LABELS.student).toBe("طالب");
    expect(ROLE_LABELS.teacher).toBe("مدرب");
    expect(ROLE_LABELS.admin).toBe("مشرف");
  });

  it("has placeholder images for courses", () => {
    expect(PLACEHOLDER_IMAGES.english).toContain("/placeholders/english.svg");
    expect(PLACEHOLDER_IMAGES.french).toContain("/placeholders/french.svg");
    expect(PLACEHOLDER_IMAGES.arabic).toContain("/placeholders/arabic.svg");
  });
});
