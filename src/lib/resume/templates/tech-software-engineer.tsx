import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function TechSoftwareEngineerTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#0ea5e9";
  const darkBg = "#0f172a"; // Deep tech slate
  const muted = "#64748b";

  // Sidebar sections vs Main column sections
  const sidebarKeys = ["skills", "languages", "socials"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#334155",
      fontSize: "9.5pt",
      lineHeight: 1.4,
      minHeight: "100%",
      display: "grid",
      gridTemplateColumns: "1fr 1.8fr",
      background: "#fff"
    }}>
      {/* Tech Left Sidebar */}
      <aside style={{
        background: darkBg,
        color: "#f1f5f9",
        padding: "1.5em",
        display: "flex",
        flexDirection: "column",
        gap: "1.5em",
        borderRight: `3px solid ${accent}`
      }}>
        {/* Photo and Name */}
        <div style={{ textAlign: "center" }}>
          {doc.photo_url && (
            <img
              src={doc.photo_url}
              alt={doc.full_name}
              style={{
                width: "6em",
                height: "6em",
                objectFit: "cover",
                borderRadius: "50%",
                border: `3px solid ${accent}`,
                marginBottom: "1em",
                background: "#1e293b"
              }}
            />
          )}
          <h1 style={{
            fontFamily: FONT_STACKS[design.headingFont],
            fontSize: "1.4em",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 0.2em 0",
            lineHeight: 1.2
          }}>
            {doc.full_name || "Nombre Completo"}
          </h1>
          <p style={{
            fontSize: "0.85em",
            color: accent,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0
          }}>
            {doc.headline || "Área Técnica"}
          </p>
        </div>

        {/* Contact info list */}
        <div style={{
          fontSize: "0.82em",
          color: "#cbd5e1",
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
          borderTop: "1px solid #334155",
          paddingTop: "1em"
        }}>
          {contactList(doc).map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
              <span style={{ color: accent }}>•</span>
              <span className="truncate">{c}</span>
            </div>
          ))}
        </div>

        {/* Sidebar Sections */}
        {sections
          .filter((k) => sidebarKeys.includes(k))
          .map((key) => (
            <div key={key} style={{ borderTop: "1px solid #334155", paddingTop: "1em" }}>
              <h3 style={{
                fontFamily: FONT_STACKS[design.headingFont],
                fontSize: "0.85em",
                fontWeight: 700,
                color: accent,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 0.6em 0"
              }}>
                {label(key)}
              </h3>
              <div style={{ fontSize: "0.88em", color: "#e2e8f0" }}>
                {renderSectionBody(key, { doc, design, muted: "#94a3b8" })}
              </div>
            </div>
          ))}
      </aside>

      {/* Main Right Column */}
      <main style={{
        padding: "1.8em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.2}em`
      }}>
        {mainKeys.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont],
              fontSize: "1.1em",
              fontWeight: 700,
              color: darkBg,
              display: "flex",
              alignItems: "center",
              gap: "0.4em",
              borderBottom: `1.5px solid ${accent}`,
              paddingBottom: "0.2em",
              marginBottom: "0.5em"
            }}>
              <span style={{ color: accent }}>{"//"}</span>
              {label(key)}
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
