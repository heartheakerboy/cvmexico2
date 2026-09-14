import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR: SectionKey[] = ["skills", "certifications", "languages", "socials"];

export function EngineeringTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const side = sections.filter((s) => SIDEBAR.includes(s));
  const main = sections.filter((s) => !SIDEBAR.includes(s));
  const muted = "#475569";
  const heading = (t: string) => (
    <h2 style={{ fontFamily: FONT_STACKS.mono, fontSize: "0.82em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: design.accent, marginBottom: "0.45em" }}>
      <span style={{ opacity: 0.5 }}>{"// "}</span>{t}
    </h2>
  );
  return (
    <div style={{ fontFamily: FONT_STACKS[design.bodyFont], color: "#0f172a", fontSize: "10.5pt" }}>
      <header style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "0.8em", marginBottom: `${design.spacing}em` }}>
        <div style={{ fontFamily: FONT_STACKS.mono, fontSize: "1.7em", fontWeight: 700 }}>{doc.full_name || "Tu Nombre"}</div>
        <div style={{ color: design.accent, fontWeight: 600, fontFamily: FONT_STACKS.mono }}>{doc.headline}</div>
        <div style={{ color: muted, fontSize: "0.82em", marginTop: "0.35em", fontFamily: FONT_STACKS.mono }}>{contactList(doc).join("  |  ")}</div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.62fr", gap: "1.4em" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
          {main.map((key) => (
            <section key={key}>{heading(label(key))}{renderSectionBody(key, { doc, design, muted })}</section>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
          {side.map((key) => (
            <section key={key}>{heading(label(key))}{renderSectionBody(key, { doc, design, muted })}</section>
          ))}
        </div>
      </div>
    </div>
  );
}