/**
 * TechSidebarEngine — Dark sidebar layout for technology and IT roles.
 * Used by: Software Engineer, Frontend, Backend, DevOps, Cloud, Security, Data, AI/ML, QA, IT Support, Network
 */
import type { TemplateProps, SectionKey } from "../../types";
import { visibleSections, FONT_STACKS } from "../../types";
import { renderSectionBody, label, hexToRgba, SkillBars } from "../../blocks";
import { contactList } from "../../contact";

export type TechSidebarConfig = {
  accent: string;
  sidebarBg?: string;
  mainKeys?: SectionKey[];
  sidebarKeys?: SectionKey[];
};

export function TechSidebarEngine({ doc, design, layout }: TemplateProps, cfg?: TechSidebarConfig) {
  const accent = cfg?.accent || design.accent || "#0ea5e9";
  const sidebarBg = cfg?.sidebarBg || "#0f172a";
  const sections = visibleSections(doc, layout);
  const sidebarKeys: SectionKey[] = cfg?.sidebarKeys || ["skills", "languages", "certifications", "socials", "interests"];
  const mainKeys: SectionKey[] = cfg?.mainKeys
    ? cfg.mainKeys.filter((k) => sections.includes(k))
    : sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      fontSize: "9.5pt",
      lineHeight: 1.45,
      color: "#1e293b",
      display: "grid",
      gridTemplateColumns: "220px 1fr",
      minHeight: "100%",
      background: "#fff",
    }}>
      {/* Dark Sidebar */}
      <aside style={{
        background: sidebarBg,
        color: "#e2e8f0",
        padding: "1.8em 1.4em",
        display: "flex",
        flexDirection: "column",
        gap: "1.4em",
      }}>
        {/* Photo */}
        {doc.photo_url && (
          <div style={{ textAlign: "center" }}>
            <img src={doc.photo_url} alt={doc.full_name} style={{
              width: "5.5em", height: "5.5em", borderRadius: "50%",
              objectFit: "cover", border: `3px solid ${accent}`, margin: "0 auto 0.5em",
            }} />
          </div>
        )}

        {/* Name + Headline */}
        <div style={{ borderBottom: `1.5px solid ${hexToRgba(accent, 0.4)}`, paddingBottom: "1em" }}>
          <div style={{
            fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.2em",
            fontWeight: 800, color: "#f1f5f9", margin: 0, letterSpacing: "0.01em",
          }}>{doc.full_name || "Tu Nombre"}</div>
          {doc.headline && (
            <p style={{ color: accent, fontSize: "0.8em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.3em" }}>
              {doc.headline}
            </p>
          )}
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3em", fontSize: "0.82em", color: "#94a3b8" }}>
          {contactList(doc).map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4em", lineHeight: 1.4 }}>
              <span style={{ color: accent, fontSize: "0.9em" }}>›</span>
              <span>{c}</span>
            </div>
          ))}
        </div>

        {/* Sidebar sections */}
        {sections.filter((k) => sidebarKeys.includes(k)).map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h3 style={{
              fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.75em",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
              color: accent, marginBottom: "0.5em", borderBottom: `1px solid ${hexToRgba(accent, 0.25)}`, paddingBottom: "0.2em",
            }}>
              {label(key)}
            </h3>
            <div style={{ fontSize: "0.88em", color: "#cbd5e1" }}>
              {key === "skills"
                ? <SkillBars items={doc.skills} design={{ ...design, accent }} />
                : renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#94a3b8" })}
            </div>
          </section>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ padding: "1.8em 1.6em", display: "flex", flexDirection: "column", gap: `${design.spacing * 1.2}em` }}>
        {mainKeys.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.95em",
              fontWeight: 700, color: "#0f172a", textTransform: "uppercase",
              letterSpacing: "0.06em", borderBottom: `2px solid ${accent}`,
              paddingBottom: "0.2em", marginBottom: "0.5em",
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#64748b" })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
