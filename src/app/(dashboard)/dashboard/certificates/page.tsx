"use client";

import { CertificateGenerator } from "@/components/dashboard/certificate-generator";

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">شهادات PDF</h1>
      <p className="text-[hsl(var(--muted-foreground))]">قم بإنشاء شهادات إتمام للدورات التدريبية وتحميلها بصيغة PDF</p>
      <CertificateGenerator />
    </div>
  );
}
