import { forwardRef } from "react";
import type { Design, Layout, ResumeDoc } from "@/lib/resume/types";
import { FONT_STACKS } from "@/lib/resume/types";
import { getTemplate } from "@/lib/resume/registry";

const PAPER_MM = {
  a4: { w: 210, h: 297 },
  letter: { w: 216, h: 279 },
};

type Props = {
  templateId: string;
  doc: ResumeDoc;
  design: Design;
  layout: Layout;
};

// The A4/Letter page rendered at real physical size (mm). Wrap it in a
// scaling container for on-screen preview; print CSS renders it 1:1.
export const ResumePaper = forwardRef<HTMLDivElement, Props>(function ResumePaper(
  { templateId, doc, design, layout },
  ref,
) {
  const tpl = getTemplate(templateId);
  const paper = PAPER_MM[design.paper];
  const Comp = tpl.component;
  // Two-column templates paint their own full-bleed sidebar, so we drop the
  // page padding for them and let the template manage insets.
  const fullBleed = [
    "executive", "modern-sidebar", "creative", "marketing",
    "premium-executive", "marketing-portfolio", "creative-premium-plus",
    "modern-wave-blue", "creative-wave-emerald",
    "tech-software-engineer", "creative-architect", "creative-graphic-designer",
    "corporate-hr-manager", "executive-project-manager",
    "stage-student", "stage-fresher", "stage-internship", "stage-entry-level",
    "stage-mid-level", "stage-senior", "stage-executive", "stage-ceo",
    "stage-freelancer"
  ].includes(templateId);
  return (
    <div
      ref={ref}
      data-resume-paper
      style={{
        width: `${paper.w}mm`,
        minHeight: `${paper.h}mm`,
        background: "#fff",
        color: "#000",
        fontFamily: FONT_STACKS[design.bodyFont],
        fontSize: `${design.fontScale * 10.5}pt`,
        padding: fullBleed ? 0 : `${design.margin}mm`,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Comp doc={doc} design={design} layout={layout} />
    </div>
  );
});