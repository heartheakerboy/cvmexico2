import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

// Professional, calm and ATS-friendly for medical/health roles.
export function HealthcareTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#475569";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#0f172a", fontSize: "10.5pt" }}>
      <header style={{ textAlign: "center", borderBottom: `2px solid ${hexToRgba(design.accent, 0.4)}`, paddingBottom: "0.8em", marginBottom: `${design.spacing}em` }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.8em", fontWeight: 700, color: design.accent }}>{doc.full_name || "Tu Nombre"}</div>
        <div style={{ fontWeight: 500, letterSpacing: "0.02em" }}>{doc.headline}</div>
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.35em" }}>{contactList(doc).join("   •   ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.92em", fontWeight: 700, color: design.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4em", display: "flex", alignItems: "center", gap: "0.4em" }}>
              <span style={{ width: "0.5em", height: "0.5em", borderRadius: "2px", background: design.accent, display: "inline-block" }} />
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}