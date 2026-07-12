import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";
import { hexToRgba } from "../blocks";

// Compact single column with a tinted name block and pill headings.
export function CompactProTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#111827", fontSize: "10.5pt" }}>
      <header style={{ marginBottom: `${design.spacing}em`, background: hexToRgba(design.accent, 0.08), borderLeft: `4px solid ${design.accent}`, padding: "0.7em 0.9em", borderRadius: "0 0.4em 0.4em 0" }}>
        <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.8em", fontWeight: 800 }}>
          {doc.full_name || "Tu Nombre"}
        </h1>
        {doc.headline && <div style={{ color: design.accent, fontWeight: 600, fontSize: "0.95em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.82em", marginTop: "0.3em" }}>{contactList(doc).join("  |  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 0.95}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ display: "inline-block", fontSize: "0.8em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", background: design.accent, padding: "0.35em 0.8em", lineHeight: 1.3, borderRadius: "999px", marginBottom: "0.45em" }}>
              {label(key)}
            </h2>
            <div style={{ paddingLeft: "0.2em" }}>{renderSectionBody(key, { doc, design, muted })}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
