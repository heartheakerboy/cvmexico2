import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, SkillBars } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR: SectionKey[] = ["skills", "languages", "certifications", "interests", "socials"];

export function ExecutiveTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const side = sections.filter((s) => SIDEBAR.includes(s));
  const main = sections.filter((s) => !SIDEBAR.includes(s));
  const muted = "#4b5563";
  return (
    <div style={{ display: "flex", fontFamily: FONT_STACKS[design.bodyFont], color: "#111827", fontSize: "10.5pt", minHeight: "100%" }}>
      <aside style={{ width: "34%", background: "#111827", color: "#e5e7eb", padding: "1.4em 1.2em", display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {doc.photo_url && (
          <img src={doc.photo_url} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "12px" }} />
        )}
        <div>
          <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.5em", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{doc.full_name || "Tu Nombre"}</h1>
          <div style={{ color: design.accent, fontWeight: 600, marginTop: "0.2em" }}>{doc.headline}</div>
        </div>
        <div style={{ fontSize: "0.85em", display: "flex", flexDirection: "column", gap: "0.25em", color: "#cbd5e1" }}>
          {contactList(doc).map((c, i) => <span key={i}>{c}</span>)}
        </div>
        {side.map((key) => (
          <div key={key}>
            <h2 style={{ fontSize: "0.8em", textTransform: "uppercase", letterSpacing: "0.12em", color: design.accent, marginBottom: "0.4em", fontWeight: 700 }}>{label(key)}</h2>
            {key === "skills" ? <SkillBars items={doc.skills} design={design} /> : renderSectionBody(key, { doc, design, muted: "#cbd5e1" })}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, padding: "1.6em 1.4em", display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {main.map((key) => (
          <section key={key}>
            <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.95em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#111827", borderBottom: `2px solid ${design.accent}`, paddingBottom: "0.25em", marginBottom: "0.5em" }}>{label(key)}</h2>
            {renderSectionBody(key, { doc, design, muted })}
          </section>
        ))}
      </main>
    </div>
  );
}