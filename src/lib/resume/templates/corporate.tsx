import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function CorporateTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#475569";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#0f172a", fontSize: "10.5pt" }}>
      <header style={{ borderBottom: `3px solid ${design.accent}`, paddingBottom: "0.7em" }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.9em", fontWeight: 700, letterSpacing: "-0.01em" }}>
          {doc.full_name || "Tu Nombre"}
        </div>
        {doc.headline && <div style={{ color: design.accent, fontWeight: 600, marginTop: "0.15em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.4em" }}>{contactList(doc).join("  •  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em`, marginTop: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.95em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: design.accent, marginBottom: "0.45em" }}>
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}