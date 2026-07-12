import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function MinimalWhiteTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#6b7280";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#1f2937", fontSize: "10.5pt", padding: "0.5em" }}>
      <header style={{ marginBottom: `${design.spacing * 1.6}em` }}>
        <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "2.1em", fontWeight: 300, letterSpacing: "0.02em" }}>{doc.full_name || "Tu Nombre"}</h1>
        <div style={{ color: muted, marginTop: "0.3em", letterSpacing: "0.04em" }}>{doc.headline}</div>
        <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.5em" }}>{contactList(doc).join("     ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.7}em` }}>
        {sections.map((key) => (
          <section key={key} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4em" }}>
            <h2 style={{ fontSize: "0.78em", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: design.accent, whiteSpace: "nowrap", paddingTop: "0.15em" }}>
              {label(key)}
            </h2>
            <div>{renderSectionBody(key, { doc, design, muted })}</div>
          </section>
        ))}
      </div>
    </div>
  );
}