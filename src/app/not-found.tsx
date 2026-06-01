import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-8xl font-bold text-teal-200 dark:text-teal-900 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها</p>
        <Link href="/">
          <Button className="gap-2"><ArrowLeft className="h-4 w-4" />العودة إلى الرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}
