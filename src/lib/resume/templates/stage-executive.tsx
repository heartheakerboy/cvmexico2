import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function StageExecutiveTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#d4af37"; // Luxury Gold
  const muted = "#3f3f46";

  // Split layout
  const sidebarKeys = ["skills", "languages", "certifications", "socials"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS.serif, // Always elegant serif for executive
      color: "#18181b",
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
        {/* Luxury Executive Header */}
        <div style={{
          borderBottom: `2.5px solid ${accent}`,
          paddingBottom: "1em",
          marginBottom: "0.5em"
        }}>
          <h1 style={{
            fontSize: "1.9em",
            fontWeight: 700,
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            margin: 0
          }}>
            {doc.full_name || "Nombre Completo"}
          </h1>
          {doc.headline && (
            <p style={{
              color: "#475569",
              fontSize: "0.9em",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0.3em 0 0 0",
              fontFamily: FONT_STACKS[design.bodyFont]
            }}>
              {doc.headline}
            </p>
          )}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8em",
            fontSize: "0.8em",
            color: muted,
            marginTop: "0.5em",
            fontFamily: FONT_STACKS[design.bodyFont]
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
              fontSize: "1.05em",
              fontWeight: 700,
              color: "#0f172a",
              borderBottom: `1.5px solid ${accent}`,
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
      </main>

      {/* Sidebar (Right side) */}
      <aside style={{
        background: "#fafaf9", // soft warm cream background
        padding: "1.8em",
        borderLeft: `1px solid ${accent}`,
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
                borderRadius: "0", // Squared traditional luxury
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
                fontSize: "0.95em",
                fontWeight: 700,
                color: "#0f172a",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "0.2em",
                marginBottom: "0.4em",
                textTransform: "uppercase",
                letterSpacing: "0.03em"
              }}>
                {label(key)}
              </h3>
              <div style={{ fontSize: "0.92em", fontFamily: FONT_STACKS[design.bodyFont] }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            </section>
          ))}
      </aside>
    </div>
  );
}
