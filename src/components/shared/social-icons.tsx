import { type ComponentProps } from "react";

type SocialIconName = "facebook" | "twitter" | "instagram" | "linkedin" | "youtube";

const iconPaths: Record<SocialIconName, string[]> = {
  facebook: [
    "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.5l.5-4h-4V7a1 1 0 0 1 1-1h3V2z",
  ],
  twitter: [
    "M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.6.8-2.5 1A4 4 0 0 0 12 8v.9A11.3 11.3 0 0 1 3.8 4.7a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2.4 18.2 11.3 11.3 0 0 0 8.6 20c7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.4-1.3 1.9-2.2z",
  ],
  instagram: [
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
    "M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z",
    "M17.5 6.5h.01",
  ],
  linkedin: [
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z",
    "M2 9h4v12H2z",
    "M4 6.5A2.5 2.5 0 1 0 4 1.5a2.5 2.5 0 0 0 0 5z",
  ],
  youtube: [
    "M22 12s0-3.3-.4-4.9a3 3 0 0 0-2.1-2.1C17.9 4.6 12 4.6 12 4.6s-5.9 0-7.5.4a3 3 0 0 0-2.1 2.1C2 8.7 2 12 2 12s0 3.3.4 4.9A3 3 0 0 0 4.5 19c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a3 3 0 0 0 2.1-2.1c.4-1.6.4-4.9.4-4.9z",
    "m10 15 5-3-5-3z",
  ],
};

interface SocialIconProps extends ComponentProps<"svg"> {
  name: SocialIconName;
}

export function SocialIcon({ name, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {iconPaths[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
