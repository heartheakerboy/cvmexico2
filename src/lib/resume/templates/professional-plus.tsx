import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";
import { hexToRgba } from "../blocks";

// Professional layout with accent side-tab headings and a monogram.
export function ProfessionalPlusTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#475569";
  const initials = (doc.full_name || "T N").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#0f172a", fontSize: "10.5pt" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "0.9em", marginBottom: `${design.spacing * 1.2}em`, paddingBottom: "0.7em", borderBottom: `2px solid ${design.accent}` }}>
        <span style={{ width: "2.6em", height: "2.6em", borderRadius: "0.5em", background: design.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1em", flexShrink: 0 }}>{initials}</span>
        <div>
          <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.9em", fontWeight: 700 }}>
            {doc.full_name || "Tu Nombre"}
          </div>
          {doc.headline && <div style={{ color: design.accent, fontWeight: 500 }}>{doc.headline}</div>}
          <div style={{ color: muted, fontSize: "0.82em", marginTop: "0.2em" }}>{contactList(doc).join("   ·   ")}</div>
        </div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontSize: "0.9em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4em", color: design.accent, borderLeft: `4px solid ${design.accent}`, background: hexToRgba(design.accent, 0.06), padding: "0.2em 0.6em" }}>
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}
