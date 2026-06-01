export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  level: "مبتدئ" | "متوسط" | "متقدم" | "مبتدئ إلى متقدم";
  duration: string;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  price: number;
  objectives: string[];
  curriculum: CurriculumItem[];
  instructorId: string;
  featured?: boolean;
}

export interface CurriculumItem {
  title: string;
  topics: string[];
}
