import Image from "next/image";
import { BookOpen, Code, Palette, Network, Shield, Briefcase, Languages } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  programming: Code,
  design: Palette,
  networking: Network,
  cybersecurity: Shield,
  office: Briefcase,
  languages: Languages,
};

const categoryColors: Record<string, string> = {
  programming: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  design: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  networking: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  cybersecurity: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  office: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  languages: "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
};

const categoryLabels: Record<string, string> = {
  programming: "برمجة",
  design: "تصميم",
  networking: "شبكات",
  cybersecurity: "أمن سيبراني",
  office: "مهارات مكتبية",
  languages: "لغات",
};

export function CourseThumbnail({
  src,
  alt,
  category,
  fill,
  className,
}: {
  src?: string;
  alt: string;
  category?: string;
  fill?: boolean;
  className?: string;
}) {
  if (src && !src.includes("placeholder") && !src.includes("just-logo") && !src.includes("BRAND_ASSETS")) {
    return <Image src={src} alt={alt} fill={fill} className={className || "object-cover"} />;
  }

  const iconKey = category ? Object.keys(categoryIcons).find((k) => category.toLowerCase().includes(k)) || "languages" : "languages";
  const Icon = categoryIcons[iconKey] || Languages;
  const colorClass = categoryColors[iconKey] || categoryColors.languages;
  const label = categoryLabels[iconKey] || categoryLabels.languages;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-3 ${colorClass}`}>
      <Icon className="w-12 h-12 md:w-16 md:h-16 opacity-80" />
      <span className="text-xs md:text-sm font-medium opacity-70">{label}</span>
    </div>
  );
}
