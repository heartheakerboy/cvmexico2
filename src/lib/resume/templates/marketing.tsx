import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function MarketingTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#52525b";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#18181b", fontSize: "10.5pt" }}>
      <header style={{ padding: "1.4em 1.5em", borderLeft: `8px solid ${design.accent}`, background: hexToRgba(design.accent, 0.06), marginBottom: `${design.spacing}em` }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "2.1em", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {doc.full_name || "Tu Nombre"}
        </div>
        <div style={{ display: "inline-block", background: design.accent, color: "#fff", fontWeight: 700, fontSize: "0.8em", padding: "0.35em 0.8em", lineHeight: 1.3, borderRadius: "999px", marginTop: "0.5em", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {doc.headline || "Especialista en Marketing"}
        </div>
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.6em" }}>{contactList(doc).join("   ·   ")}</div>
      </header>
      <div style={{ padding: "0 1.5em", display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1em", fontWeight: 800, color: design.accent, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.45em", display: "flex", alignItems: "center", gap: "0.5em" }}>
              <span style={{ width: "1.1em", height: "0.22em", borderRadius: "999px", background: design.accent, display: "inline-block" }} />
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}