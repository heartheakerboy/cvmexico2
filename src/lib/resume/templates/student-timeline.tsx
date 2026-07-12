import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

// Student timeline: side-labeled sections with dot markers, clean and modern.
export function StudentTimelineTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#1f2937", fontSize: "10.5pt" }}>
      <header style={{ textAlign: "center", marginBottom: `${design.spacing * 1.2}em` }}>
        <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "2em", fontWeight: 700, color: design.accent }}>{doc.full_name || "Tu Nombre"}</h1>
        {doc.headline && <div style={{ fontWeight: 500, marginTop: "0.15em" }}>{doc.headline}</div>}
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.35em" }}>{contactList(doc).join("  •  ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key} style={{ display: "grid", gridTemplateColumns: "8em 1fr", gap: "1em" }}>
            <div style={{ borderRight: `2px solid ${hexToRgba(design.accent, 0.3)}`, paddingRight: "0.8em", position: "relative" }}>
              <h2 style={{ fontSize: "0.82em", fontWeight: 700, color: design.accent, textAlign: "right", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label(key)}</h2>
              <span style={{ position: "absolute", right: "-0.32em", top: "0.3em", width: "0.55em", height: "0.55em", borderRadius: "999px", background: design.accent }} />
            </div>
            <div>{renderSectionBody(key, { doc, design, muted })}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
