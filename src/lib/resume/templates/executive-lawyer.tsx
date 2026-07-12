import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function ExecutiveLawyerTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#0f172a"; // Deep black/slate
  const muted = "#3f3f46";

  // Split layout
  const sidebarKeys = ["skills", "languages", "certifications", "socials"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS.serif, // Default to serif for lawyer
      color: "#18181b",
      fontSize: "9.5pt",
      lineHeight: 1.45,
      minHeight: "100%",
      padding: "2em",
      background: "#fff"
    }}>
      {/* Traditional Legal Header */}
      <header style={{
        textAlign: "center",
        borderTop: `2px solid ${accent}`,
        borderBottom: `2px solid ${accent}`,
        padding: "1.2em 0",
        marginBottom: `${design.spacing * 1.2}em`
      }}>
        {doc.photo_url && (
          <img
            src={doc.photo_url}
            alt={doc.full_name}
            style={{
              width: "5.5em",
              height: "5.5em",
              objectFit: "cover",
              borderRadius: "0", // Square for prestige traditional lawyer
              border: `2px solid ${accent}`,
              marginBottom: "1em",
              background: "#fff"
            }}
          />
        )}
        <h1 style={{
          fontSize: "1.85em",
          fontWeight: 700,
          color: "#000",
          margin: 0,
          letterSpacing: "0.02em",
          textTransform: "uppercase"
        }}>
          {doc.full_name || "Nombre Completo"}
        </h1>
        {doc.headline && (
          <p style={{
            fontSize: "0.9em",
            color: accent,
            fontWeight: 600,
            margin: "0.3em 0 0.5em 0",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontFamily: FONT_STACKS[design.bodyFont]
          }}>
            {doc.headline}
          </p>
        )}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.2em",
          fontSize: "0.8em",
          color: muted,
          fontFamily: FONT_STACKS[design.bodyFont]
        }}>
          {contactList(doc).map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && <span style={{ margin: "0 0.6em", color: "#d4d4d8" }}>•</span>}
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* Columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr",
        gap: "1.8em"
      }}>
        {/* Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.2}em` }}>
          {mainKeys.map((key) => (
            <section key={key} style={{ pageBreakInside: "avoid" }}>
              <h2 style={{
                fontSize: "1.05em",
                fontWeight: 700,
                color: "#000",
                borderBottom: "1px solid #18181b",
                paddingBottom: "0.2em",
                marginBottom: "0.45em",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}>
                {label(key)}
              </h2>
              <div style={{ color: "#27272a", fontFamily: FONT_STACKS[design.bodyFont] }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: `${design.spacing * 1.2}em`
        }}>
          {sections
            .filter((k) => sidebarKeys.includes(k))
            .map((key) => (
              <section key={key} style={{ pageBreakInside: "avoid" }}>
                <h3 style={{
                  fontSize: "0.98em",
                  fontWeight: 700,
                  color: "#000",
                  borderBottom: "1px solid #18181b",
                  paddingBottom: "0.2em",
                  marginBottom: "0.4em",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em"
                }}>
                  {label(key)}
                </h3>
                <div style={{ fontSize: "0.9em", color: "#27272a", fontFamily: FONT_STACKS[design.bodyFont] }}>
                  {renderSectionBody(key, { doc, design, muted })}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}
