export const COURSE_CURRENCY = {
  code: "SDG",
  label: "جنيه سوداني",
};

export function formatCoursePrice(price: number): string {
  return `${price} ${COURSE_CURRENCY.label}`;
}
