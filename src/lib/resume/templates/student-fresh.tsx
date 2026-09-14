import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

// Fresh student: bold top color band, education-forward, playful chips.
export function StudentFreshTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#1f2937", fontSize: "10.5pt" }}>
      <header style={{ background: design.accent, color: "#fff", borderRadius: "14px", padding: "1.2em 1.3em", marginBottom: `${design.spacing}em` }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.9em", fontWeight: 800 }}>{doc.full_name || "Tu Nombre"}</div>
        {doc.headline && <div style={{ fontWeight: 500, opacity: 0.95 }}>{doc.headline}</div>}
        <div style={{ fontSize: "0.85em", marginTop: "0.35em", opacity: 0.9 }}>{contactList(doc).join("  •  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ display: "inline-block", fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.9em", fontWeight: 700, color: design.accent, borderBottom: `2px solid ${hexToRgba(design.accent, 0.4)}`, paddingBottom: "0.15em", marginBottom: "0.45em" }}>{label(key)}</h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}
