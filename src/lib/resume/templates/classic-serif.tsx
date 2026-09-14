import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";
import { hexToRgba } from "../blocks";

// Classic serif with an elegant double-rule header band.
export function ClassicSerifTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#374151";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#111827", fontSize: "10.5pt" }}>
      <header style={{ textAlign: "center", marginBottom: `${design.spacing * 1.3}em`, padding: "0.6em 0", borderTop: `3px double ${design.accent}`, borderBottom: `3px double ${design.accent}` }}>
        <div style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "2.1em", fontWeight: 700, letterSpacing: "0.06em", color: design.accent }}>
          {doc.full_name || "Tu Nombre"}
        </div>
        {doc.headline && <div style={{ color: muted, marginTop: "0.2em", fontStyle: "italic", letterSpacing: "0.03em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.4em" }}>{contactList(doc).join("  •  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: design.accent, textAlign: "center", marginBottom: "0.5em", position: "relative" }}>
              <span style={{ background: "#fff", padding: "0 0.8em", position: "relative", zIndex: 1 }}>{label(key)}</span>
              <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: hexToRgba(design.accent, 0.4) }} />
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}
