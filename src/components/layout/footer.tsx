import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { SITE, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  const socialIcons = [
    { label: "فيس بوك", href: SOCIAL_LINKS.facebook },
    { label: "تويتر", href: SOCIAL_LINKS.twitter },
    { label: "إنستغرام", href: SOCIAL_LINKS.instagram },
    { label: "لينكد إن", href: SOCIAL_LINKS.linkedin },
    { label: "يوتيوب", href: SOCIAL_LINKS.youtube },
  ];

  return (
    <footer className="border-t bg-[hsl(var(--muted))]/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt={SITE.name} width={36} height={36} className="h-9 w-auto" />
              <span className="text-xl font-bold text-teal-600 dark:text-teal-400">{SITE.name}</span>
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              وجهتك الأولى لتعلم اللغات عبر الإنترنت. نقدم دورات معتمدة مع أفضل المدربين لتطوير مهاراتك اللغوية.
            </p>
            <div className="flex gap-2">
              {socialIcons.map(({ label, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" title={label} className="p-2 rounded-lg bg-[hsl(var(--muted))] hover:bg-teal-100 dark:hover:bg-teal-900/50 text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">الخدمات</h4>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دورات اللغة الإنجليزية</Link></li>
              <li><Link href="/courses" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دورات اللغة الفرنسية</Link></li>
              <li><Link href="/courses" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دورات اللغة الألمانية</Link></li>
              <li><Link href="/courses" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دورات اللغة الإسبانية</Link></li>
              <li><Link href="/courses" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دورات اللغة العربية</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Phone className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {SITE.phone}
              </li>
              <li className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {SITE.email}
              </li>
              <li className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                {SITE.address}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            &copy; {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            تصميم وتطوير فريق {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
