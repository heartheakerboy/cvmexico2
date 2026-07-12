import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function StageMidLevelTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#4f46e5"; // Indigo
  const muted = "#4b5563";

  // Split layout
  const sidebarKeys = ["skills", "languages", "certifications", "interests"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#1e293b",
      fontSize: "9.5pt",
      lineHeight: 1.45,
      minHeight: "100%",
      display: "grid",
      gridTemplateColumns: "1.7fr 1.05fr",
      background: "#fff"
    }}>
      {/* Main Details (Left side) */}
      <main style={{
        padding: "1.8em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.15}em`
      }}>
        {/* Mid-Level Header */}
        <div style={{
          borderBottom: `3px solid ${accent}`,
          paddingBottom: "0.8em",
          marginBottom: "0.5em"
        }}>
          <h1 style={{
            fontFamily: FONT_STACKS[design.headingFont],
            fontSize: "1.8em",
            fontWeight: 800,
            color: "#0f172a",
            margin: 0
          }}>
            {doc.full_name || "Nombre Completo"}
          </h1>
          {doc.headline && (
            <p style={{
              color: accent,
              fontSize: "0.95em",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              margin: "0.2em 0 0 0"
            }}>
              {doc.headline}
            </p>
          )}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8em",
            fontSize: "0.82em",
            color: muted,
            marginTop: "0.4em"
          }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && <span style={{ margin: "0 0.4em", color: "#cbd5e1" }}>•</span>}
                {c}
              </span>
            ))}
          </div>
        </div>

        {mainKeys.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont],
              fontSize: "1.05em",
              fontWeight: 700,
              color: "#0f172a",
              borderBottom: "1.5px solid #e2e8f0",
              paddingBottom: "0.2em",
              marginBottom: "0.45em",
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </main>

      {/* Sidebar (Right side) */}
      <aside style={{
        background: "#fafafa",
        padding: "1.8em",
        borderLeft: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.15}em`
      }}>
        {/* Optional Photo */}
        {doc.photo_url && (
          <div style={{ textAlign: "center", marginBottom: "0.5em" }}>
            <img
              src={doc.photo_url}
              alt={doc.full_name}
              style={{
                width: "6em",
                height: "6em",
                objectFit: "cover",
                borderRadius: "50%",
                border: `2px solid ${accent}`,
                background: "#fff",
                margin: "0 auto"
              }}
            />
          </div>
        )}

        {sections
          .filter((k) => sidebarKeys.includes(k))
          .map((key) => (
            <section key={key} style={{ pageBreakInside: "avoid" }}>
              <h3 style={{
                fontFamily: FONT_STACKS[design.headingFont],
                fontSize: "0.95em",
                fontWeight: 700,
                color: "#0f172a",
                borderBottom: `2.5px solid ${accent}`,
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
      </aside>
    </div>
  );
}
