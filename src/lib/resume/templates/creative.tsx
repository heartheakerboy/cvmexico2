import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function CreativeTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#57534e";
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#292524", fontSize: "10.5pt" }}>
      <header style={{ background: `linear-gradient(135deg, ${design.accent}, ${hexToRgba(design.accent, 0.75)})`, color: "#fff", padding: "1.8em 1.6em", display: "flex", alignItems: "center", gap: "1.2em" }}>
        {doc.photo_url && (
          <img src={doc.photo_url} alt="" style={{ width: "5.5em", height: "5.5em", objectFit: "cover", borderRadius: "999px", border: "3px solid rgba(255,255,255,0.7)" }} />
        )}
        <div>
          <h1 style={{ fontFamily: FONT_STACKS.serif, fontSize: "2.3em", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>{doc.full_name || "Tu Nombre"}</h1>
          <div style={{ fontStyle: "italic", fontSize: "1.05em", marginTop: "0.25em", opacity: 0.95 }}>{doc.headline}</div>
          <div style={{ fontSize: "0.82em", marginTop: "0.5em", opacity: 0.9 }}>{contactList(doc).join("   ·   ")}</div>
        </div>
      </header>
      <div style={{ padding: "1.5em 1.6em", display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={{ fontFamily: FONT_STACKS.serif, fontSize: "1.2em", fontWeight: 700, color: design.accent, marginBottom: "0.4em" }}>
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </div>
    </div>
  );
}