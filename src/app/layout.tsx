import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { SITE } from "@/lib/constants";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/layout/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: SITE.name + " | " + SITE.tagline,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["تعليم لغات", "دورات لغوية", "تعلم الإنجليزية", "تعلم الفرنسية", "أكاديمية لغات", "تدريب لغوي"],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    locale: "ar_SA",
    siteName: SITE.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
