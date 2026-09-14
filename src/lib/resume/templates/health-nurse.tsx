import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function HealthNurseTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#0d9488"; // Medical teal
  const muted = "#4b5563";

  // Split layout
  const sidebarKeys = ["skills", "languages", "certifications", "references"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#1f2937",
      fontSize: "9.5pt",
      lineHeight: 1.45,
      minHeight: "100%"
    }}>
      {/* Clinical Top Header strip */}
      <header style={{
        background: `linear-gradient(135deg, ${accent} 0%, #115e59 100%)`,
        color: "#fff",
        padding: "1.8em",
        display: "flex",
        alignItems: "center",
        gap: "1.5em",
        borderBottom: "4px solid #cbd5e1"
      }}>
        {doc.photo_url && (
          <img
            src={doc.photo_url}
            alt={doc.full_name}
            style={{
              width: "5.5em",
              height: "5.5em",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid #fff",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              background: "#fff"
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: FONT_STACKS[design.headingFont],
            fontSize: "1.7em",
            fontWeight: 700,
            color: "#fff",
            margin: 0
          }}>
            {doc.full_name || "Nombre Completo"}
          </div>
          <p style={{
            fontSize: "0.95em",
            color: "#ccfbf1",
            fontWeight: 500,
            margin: "0.2em 0 0.4em 0",
            textTransform: "uppercase",
            letterSpacing: "0.03em"
          }}>
            {doc.headline || "Enfermero/a Especialista"}
          </p>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8em",
            fontSize: "0.82em",
            color: "#e2e8f0"
          }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && <span style={{ margin: "0 0.5em", color: "#99f6e4" }}>•</span>}
                {c}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr",
        gap: "1.5em",
        padding: "1.5em"
      }}>
        {/* Left main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.15}em` }}>
          {mainKeys.map((key) => (
            <section key={key} style={{ pageBreakInside: "avoid" }}>
              <h2 style={{
                fontFamily: FONT_STACKS[design.headingFont],
                fontSize: "1.05em",
                fontWeight: 700,
                color: accent,
                borderBottom: `2px solid #e5e7eb`,
                paddingBottom: "0.25em",
                marginBottom: "0.45em",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}>
                {label(key)}
              </h2>
              <div style={{ color: "#374151" }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            </section>
          ))}
        </div>

        {/* Right sidebar */}
        <div style={{
          borderLeft: "1px solid #e5e7eb",
          paddingLeft: "1.2em",
          display: "flex",
          flexDirection: "column",
          gap: `${design.spacing * 1.15}em`
        }}>
          {sections
            .filter((k) => sidebarKeys.includes(k))
            .map((key) => (
              <section key={key} style={{ pageBreakInside: "avoid" }}>
                <h3 style={{
                  fontFamily: FONT_STACKS[design.headingFont],
                  fontSize: "0.95em",
                  fontWeight: 700,
                  color: "#1e293b",
                  borderBottom: `1.5px solid ${accent}`,
                  paddingBottom: "0.2em",
                  marginBottom: "0.4em",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em"
                }}>
                  {label(key)}
                </h3>
                <div style={{ fontSize: "0.92em" }}>
                  {renderSectionBody(key, { doc, design, muted })}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}
