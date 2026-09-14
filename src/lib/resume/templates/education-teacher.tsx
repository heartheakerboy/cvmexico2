import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function EducationTeacherTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#ca8a04"; // Academic gold/amber
  const muted = "#52525b";

  // Sidebar keys
  const sidebarKeys = ["skills", "languages", "certifications", "interests"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#27272a",
      fontSize: "9.8pt",
      lineHeight: 1.45,
      minHeight: "100%",
      padding: "1.8em",
      background: "#fafaf9" // Warm paper feel
    }}>
      {/* Editorial Academic Header */}
      <header style={{
        textAlign: "center",
        borderBottom: `3px double ${accent}`,
        paddingBottom: "1.2em",
        marginBottom: `${design.spacing * 1.3}em`
      }}>
        {doc.photo_url && (
          <img
            src={doc.photo_url}
            alt={doc.full_name}
            style={{
              width: "6em",
              height: "6em",
              objectFit: "cover",
              borderRadius: "8px", // Soft square
              border: `2px solid ${accent}`,
              marginBottom: "1em",
              background: "#fff"
            }}
          />
        )}
        <div style={{
          fontFamily: FONT_STACKS.serif, // Always elegant serif for name in teacher template
          fontSize: "1.9em",
          fontWeight: 700,
          color: "#1c1917",
          margin: 0,
          letterSpacing: "0.01em"
        }}>
          {doc.full_name || "Nombre Completo"}
        </div>
        <p style={{
          fontSize: "0.95em",
          color: accent,
          fontWeight: 600,
          margin: "0.2em 0 0.5em 0",
          fontFamily: FONT_STACKS[design.headingFont],
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          {doc.headline || "Profesional de la Educación"}
        </p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1em",
          fontSize: "0.82em",
          color: muted
        }}>
          {contactList(doc).map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && <span style={{ margin: "0 0.5em", color: "#d6d3d1" }}>♦</span>}
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* Main Grid split */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.7fr 1fr",
        gap: "1.8em"
      }}>
        {/* Left Column - Main Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.2}em` }}>
          {mainKeys.map((key) => (
            <section key={key} style={{ pageBreakInside: "avoid" }}>
              <h2 style={{
                fontFamily: FONT_STACKS.serif,
                fontSize: "1.1em",
                fontWeight: 700,
                color: "#1c1917",
                borderBottom: `1px solid ${accent}`,
                paddingBottom: "0.2em",
                marginBottom: "0.5em"
              }}>
                {label(key)}
              </h2>
              <div style={{ color: "#44403c" }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            </section>
          ))}
        </div>

        {/* Right Column - Sidebar */}
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
                  fontFamily: FONT_STACKS.serif,
                  fontSize: "1.02em",
                  fontWeight: 700,
                  color: "#1c1917",
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "0.2em",
                  marginBottom: "0.45em"
                }}>
                  {label(key)}
                </h3>
                <div style={{ fontSize: "0.92em", color: "#44403c" }}>
                  {renderSectionBody(key, { doc, design, muted })}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}
