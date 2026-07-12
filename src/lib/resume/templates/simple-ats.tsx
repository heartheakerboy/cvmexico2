import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

// Maximum ATS compatibility: single column, no graphics, no color fills,
// plain semantic headings and black text.
export function SimpleAtsTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#333333";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#000", fontSize: "10.5pt" }}>
      <header style={{ textAlign: "center", marginBottom: `${design.spacing}em` }}>
        <h1 style={{ fontSize: "1.7em", fontWeight: 700 }}>{doc.full_name || "Tu Nombre"}</h1>
        {doc.headline && <div style={{ marginTop: "0.15em" }}>{doc.headline}</div>}
        <div style={{ fontSize: "0.88em", marginTop: "0.3em" }}>{contactList(doc).join(" | ")}</div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontSize: "1em", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: "0.15em", marginBottom: "0.4em" }}>
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}