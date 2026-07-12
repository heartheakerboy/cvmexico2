import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";
import { hexToRgba } from "../blocks";

// Left-labeled sections with a continuous accent rail down the page.
export function TimelineAtsTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#111827", fontSize: "10.5pt" }}>
      <header style={{ marginBottom: `${design.spacing * 1.2}em`, background: hexToRgba(design.accent, 0.07), padding: "0.9em 1em", borderRadius: "0.5em" }}>
        <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.9em", fontWeight: 700, color: design.accent }}>
          {doc.full_name || "Tu Nombre"}
        </h1>
        {doc.headline && <div style={{ fontWeight: 600, marginTop: "0.15em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.35em" }}>{contactList(doc).join("  •  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {sections.map((key) => (
          <section key={key} style={{ display: "grid", gridTemplateColumns: "8.5em 1fr", gap: "1em", position: "relative" }}>
            <div style={{ borderRight: `2px solid ${hexToRgba(design.accent, 0.35)}`, paddingRight: "0.8em", position: "relative" }}>
              <h2 style={{ fontSize: "0.82em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: design.accent, paddingTop: "0.1em", textAlign: "right" }}>
                {label(key)}
              </h2>
              <span style={{ position: "absolute", right: "-0.32em", top: "0.35em", width: "0.55em", height: "0.55em", borderRadius: "999px", background: design.accent }} />
            </div>
            <div>{renderSectionBody(key, { doc, design, muted })}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
