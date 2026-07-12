import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

// Student / recent graduate: education-forward, friendly rounded header.
export function GraduateTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#1f2937", fontSize: "10.5pt" }}>
      <header style={{ background: hexToRgba(design.accent, 0.1), borderRadius: "16px", padding: "1.3em 1.4em", marginBottom: `${design.spacing}em`, display: "flex", alignItems: "center", gap: "1em" }}>
        {doc.photo_url && <img src={doc.photo_url} alt="" style={{ width: "5em", height: "5em", objectFit: "cover", borderRadius: "999px" }} />}
        <div>
          <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.8em", fontWeight: 700, color: design.accent }}>{doc.full_name || "Tu Nombre"}</h1>
          <div style={{ fontWeight: 500 }}>{doc.headline}</div>
          <div style={{ color: muted, fontSize: "0.85em", marginTop: "0.3em" }}>{contactList(doc).join("  •  ")}</div>
        </div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {sections.map((key) => (
          <section key={key} style={{ background: "#fff", border: `1px solid ${hexToRgba(design.accent, 0.15)}`, borderRadius: "12px", padding: "0.9em 1.1em" }}>
            <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.92em", fontWeight: 700, color: design.accent, marginBottom: "0.45em" }}>{label(key)}</h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}