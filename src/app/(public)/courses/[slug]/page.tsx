import { notFound } from "next/navigation";
import { getCourseBySlugAdmin } from "@/lib/firestore-admin";
import { adminAuthIsConfigured } from "@/lib/firebase-admin";
import { getCourseBySlug } from "@/data/courses";
import { logger } from "@/lib/logger";
import { CourseDetailClient } from "./course-detail-client";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = adminAuthIsConfigured() ? await getCourseBySlugAdmin(slug) : getCourseBySlug(slug);
  if (!course) { logger.warn("Course not found", { slug }); notFound(); }
  return <CourseDetailClient course={course} />;
}
