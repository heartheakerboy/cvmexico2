import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";
import { hexToRgba } from "../blocks";

// Minimal with an accent underline on the name and numbered dot headings.
export function CleanSlateTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#6b7280";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#1f2937", fontSize: "10.5pt" }}>
      <header style={{ marginBottom: `${design.spacing * 1.5}em` }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "2.3em", fontWeight: 600, display: "inline-block", borderBottom: `4px solid ${design.accent}`, paddingBottom: "0.1em" }}>
          {doc.full_name || "Tu Nombre"}
        </div>
        {doc.headline && <div style={{ color: muted, marginTop: "0.35em", fontSize: "1.05em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.5em" }}>{contactList(doc).join("     ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.35}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.5em", fontSize: "0.85em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: design.accent, marginBottom: "0.5em" }}>
              <span style={{ width: "0.5em", height: "0.5em", borderRadius: "999px", background: design.accent }} />
              {label(key)}
              <span style={{ flex: 1, height: 1, background: hexToRgba(design.accent, 0.25) }} />
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}
