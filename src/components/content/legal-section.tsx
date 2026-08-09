import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalSectionListProps {
  sections: LegalSection[];
  className?: string;
}

export function LegalSectionList({ sections, className }: LegalSectionListProps) {
  return (
    <div className={cn("space-y-10", className)}>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="text-xl font-semibold text-navy-deep">{section.title}</h2>
          <div className="prose-ovipeps mt-4">{section.content}</div>
        </section>
      ))}
    </div>
  );
}
