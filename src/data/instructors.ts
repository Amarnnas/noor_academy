import { Instructor } from "@/types/instructor";
import { BRAND_ASSETS } from "@/lib/constants";

export const instructors: Instructor[] = [
  {
    id: "1",
    name: "  أ. نور الدين ",
    title: "مدرب لغة إنجليزية معتمد",
    bio: "دكتوراه في تدريس اللغة الإنجليزية من جامعة أكسفورد. خبرة أكثر من 15 عاماً في تدريس الإنجليزية لغير الناطقين بها. حاصل على شهادة CELTA وDELTA.",
    image: BRAND_ASSETS.symbol,
    specialties: ["الإنجليزية", "IELTS", "TOEFL", "الإنجليزية للأعمال"],
    experience: "7 سنة",
    rating: 4.9,
    studentsCount: 3200,
  },
  {
    id: "2",
    name: "سارة بوعبد الله",
    title: "مدربة لغة فرنسية",
    bio: "حاصلة على ماجستير في اللغة الفرنسية وآدابها من جامعة السوربون. متخصصة في تدريس الفرنسية كلغة أجنبية (FLE) بأكثر من 10 سنوات خبرة.",
    image: BRAND_ASSETS.symbol,
    specialties: ["الفرنسية", "FLE", "الفرنسية للأعمال", "التحضير لـ DELF"],
    experience: "10 سنوات",
    rating: 4.8,
    studentsCount: 1800,
  },
  {
    id: "3",
    name: "كريم فريد",
    title: "مدرب لغة ألمانية",
    bio: "خريج جامعة برلين الحرة في تدريس اللغة الألمانية. معتمد من معهد جوته في المستويات A1-C2. خبرة 8 سنوات في تدريس الألمانية للعرب.",
    image: BRAND_ASSETS.symbol,
    specialties: ["الألمانية", "Goethe", "TestDaF", "الألمانية للأغراض الأكاديمية"],
    experience: "8 سنوات",
    rating: 4.7,
    studentsCount: 1500,
  },
  {
    id: "4",
    name: "ماريا غارسيا",
    title: "مدربة لغة إسبانية",
    bio: "ناطقة أصلية للإسبانية من مدريد. ماجستير في تدريس الإسبانية كلغة أجنبية من جامعة كمبلوتنسي. خبرة 7 سنوات في تدريس الإسبانية.",
    image: BRAND_ASSETS.symbol,
    specialties: ["الإسبانية", "DELE", "الإسبانية للسفر", "ثقافة أمريكا اللاتينية"],
    experience: "7 سنوات",
    rating: 4.6,
    studentsCount: 1100,
  },
  {
    id: "5",
    name: "د. عبد الرحمن الزهراني",
    title: "مدرب لغة عربية للناطقين بغيرها",
    bio: "دكتوراه في اللغويات التطبيقية من جامعة أم القرى. متخصص في تعليم العربية للناطقين بغيرها، معتمد من معهد الملك عبد الله لتعليم العربية.",
    image: BRAND_ASSETS.symbol,
    specialties: ["العربية", "النحو", "الخط العربي", "الثقافة الإسلامية"],
    experience: "12 سنة",
    rating: 4.8,
    studentsCount: 2100,
  },
];

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((i) => i.id === id);
}
