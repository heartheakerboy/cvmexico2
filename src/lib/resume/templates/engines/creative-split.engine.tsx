/**
 * CreativeSplitEngine — Bold colored left panel with right content area.
 * Used by: Graphic Designer, UI/UX, Product Designer, Video Editor, Content Writer, Copywriter, SEO, Marketing, Social Media, Photographer, Journalist, Event Manager
 */
import type { TemplateProps, SectionKey } from "../../types";
import { visibleSections, FONT_STACKS } from "../../types";
import { renderSectionBody, label, hexToRgba, Chips } from "../../blocks";
import { contactList } from "../../contact";

export type CreativeSplitConfig = {
  accent: string;
  panelBg?: string;
};

export function CreativeSplitEngine({ doc, design, layout }: TemplateProps, cfg?: CreativeSplitConfig) {
  const accent = cfg?.accent || design.accent || "#8b5cf6";
  const panelBg = cfg?.panelBg || accent;
  const sections = visibleSections(doc, layout);
  const sidebarKeys: SectionKey[] = ["skills", "languages", "socials", "interests", "certifications"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont], fontSize: "9.5pt",
      lineHeight: 1.45, color: "#1e293b",
      display: "grid", gridTemplateColumns: "1fr 1.8fr",
      minHeight: "100%", background: "#fff",
    }}>
      {/* Colored Left Panel */}
      <aside style={{
        background: panelBg, color: "#fff",
        padding: "1.8em 1.3em",
        display: "flex", flexDirection: "column", gap: "1.4em",
      }}>
        {/* Photo */}
        {doc.photo_url ? (
          <div style={{ textAlign: "center" }}>
            <img src={doc.photo_url} alt={doc.full_name} style={{
              width: "6em", height: "6em", borderRadius: "1em",
              objectFit: "cover", border: "3px solid rgba(255,255,255,0.4)", margin: "0 auto",
            }} />
          </div>
        ) : (
          <div style={{
            width: "5em", height: "5em", borderRadius: "50%",
            border: "2px dashed rgba(255,255,255,0.5)", margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7em", color: "rgba(255,255,255,0.7)",
          }}>Foto</div>
        )}

        {/* Name + headline */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "1em" }}>
          <div style={{
            fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.25em",
            fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2,
          }}>{doc.full_name || "Tu Nombre"}</div>
          {doc.headline && (
            <p style={{ fontSize: "0.8em", fontWeight: 600, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "0.3em" }}>
              {doc.headline}
            </p>
          )}
        </div>

        {/* Contact */}
        <div style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.85)", display: "flex", flexDirection: "column", gap: "0.3em" }}>
          {contactList(doc).map((c, i) => <div key={i}>{c}</div>)}
        </div>

        {/* Sidebar sections */}
        {sections.filter((k) => sidebarKeys.includes(k)).map((key) => (
          <section key={key}>
            <h3 style={{
              fontSize: "0.75em", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)",
              borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: "0.2em", marginBottom: "0.5em",
            }}>
              {label(key)}
            </h3>
            <div style={{ fontSize: "0.88em" }}>
              {key === "skills"
                ? <Chips items={doc.skills} design={{ ...design, accent: "rgba(255,255,255,0.9)" }} />
                : renderSectionBody(key, { doc, design: { ...design, accent: "rgba(255,255,255,0.9)" }, muted: "rgba(255,255,255,0.7)" })}
            </div>
          </section>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ padding: "1.8em 1.6em", display: "flex", flexDirection: "column", gap: `${design.spacing * 1.2}em` }}>
        {mainKeys.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.95em", fontWeight: 700,
              color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em",
              display: "flex", alignItems: "center", gap: "0.5em",
              borderBottom: `1.5px solid ${hexToRgba(accent, 0.2)}`,
              paddingBottom: "0.2em", marginBottom: "0.5em",
            }}>
              <span style={{ display: "inline-block", width: "4px", height: "0.9em", background: accent, borderRadius: "2px" }} />
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
