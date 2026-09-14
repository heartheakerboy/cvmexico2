import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

// Simple student: clean single column, ATS-safe, ideal for first CV.
export function StudentSimpleTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#6b7280";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#111827", fontSize: "10.5pt" }}>
      <header style={{ marginBottom: `${design.spacing * 1.2}em`, paddingBottom: "0.6em", borderBottom: `2px solid ${design.accent}` }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.9em", fontWeight: 700 }}>{doc.full_name || "Tu Nombre"}</div>
        {doc.headline && <div style={{ color: design.accent, fontWeight: 600, marginTop: "0.15em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.35em" }}>{contactList(doc).join("  •  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontSize: "0.9em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: design.accent, marginBottom: "0.4em" }}>{label(key)}</h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}
