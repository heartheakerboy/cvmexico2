import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR: SectionKey[] = ["skills", "languages", "certifications", "interests", "socials", "references"];

export function ModernSidebarTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const side = sections.filter((s) => SIDEBAR.includes(s));
  const main = sections.filter((s) => !SIDEBAR.includes(s));
  const muted = "#64748b";
  return (
    <div style={{ display: "flex", fontFamily: FONT_STACKS[design.bodyFont], color: "#1e293b", fontSize: "10.5pt", minHeight: "100%" }}>
      <aside style={{ width: "32%", background: hexToRgba(design.accent, 0.07), padding: "1.4em 1.1em", display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
        {doc.photo_url && (
          <img src={doc.photo_url} alt="" style={{ width: "6.5em", height: "6.5em", objectFit: "cover", borderRadius: "999px", border: `3px solid ${design.accent}`, alignSelf: "center" }} />
        )}
        <div style={{ fontSize: "0.85em", display: "flex", flexDirection: "column", gap: "0.3em", color: muted }}>
          {contactList(doc).map((c, i) => <span key={i}>{c}</span>)}
        </div>
        {side.map((key) => (
          <div key={key}>
            <h2 style={{ fontSize: "0.82em", textTransform: "uppercase", letterSpacing: "0.1em", color: design.accent, marginBottom: "0.4em", fontWeight: 700 }}>{label(key)}</h2>
            {renderSectionBody(key, { doc, design, muted })}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, padding: "1.5em 1.4em" }}>
        <header style={{ marginBottom: `${design.spacing}em` }}>
          <h1 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.8em", fontWeight: 700, lineHeight: 1.1 }}>{doc.full_name || "Tu Nombre"}</h1>
          <div style={{ color: design.accent, fontWeight: 600 }}>{doc.headline}</div>
        </header>
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing}em` }}>
          {main.map((key) => (
            <section key={key}>
              <h2 style={{ fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.95em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5em" }}>{label(key)}</h2>
              {key === "experience" ? (
                <div style={{ borderLeft: `2px solid ${hexToRgba(design.accent, 0.35)}`, paddingLeft: "0.9em", display: "flex", flexDirection: "column", gap: "0.6em" }}>
                  {doc.experience.map((e, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "-1.2em", top: "0.25em", width: "0.55em", height: "0.55em", borderRadius: "999px", background: design.accent }} />
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
                        <span style={{ fontWeight: 600 }}>{e.role || "Puesto"}</span>
                        <span style={{ color: muted, fontSize: "0.85em", whiteSpace: "nowrap" }}>{e.period}</span>
                      </div>
                      <div style={{ color: design.accent, fontSize: "0.9em", fontWeight: 500 }}>{[e.company, e.location].filter(Boolean).join(" · ")}</div>
                      {e.description && <p style={{ color: muted, marginTop: "0.15em", lineHeight: 1.5 }}>{e.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                renderSectionBody(key, { doc, design, muted })
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}