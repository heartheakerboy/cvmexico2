import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function StageGovernmentTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = "#000000"; // Strict Black
  const muted = "#4b5563";

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#111827",
      fontSize: "9.5pt",
      lineHeight: 1.4,
      background: "#fff"
    }}>
      {/* Official Strict Header (No Photo/Decorations) */}
      <header style={{
        marginBottom: `${design.spacing * 1.15}em`,
        borderBottom: `2.5px solid ${accent}`,
        paddingBottom: "0.8em"
      }}>
        <h1 style={{
          fontFamily: FONT_STACKS[design.headingFont],
          fontSize: "1.75em",
          fontWeight: 700,
          color: "#000000",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          margin: 0
        }}>
          {doc.full_name || "Nombre Completo"}
        </h1>
        
        {doc.headline && (
          <div style={{
            color: "#374151",
            fontWeight: 600,
            fontSize: "0.95em",
            marginTop: "0.2em",
            textTransform: "uppercase",
            letterSpacing: "0.04em"
          }}>
            {doc.headline}
          </div>
        )}
        
        <div style={{
          marginTop: "0.4em",
          fontSize: "0.85em",
          color: muted,
          display: "flex",
          flexWrap: "wrap",
          gap: "1em"
        }}>
          {contactList(doc).map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && <span style={{ margin: "0 0.5em", color: "#cbd5e1" }}>|</span>}
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* Main Single Column */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.15}em`
      }}>
        {sections.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont],
              fontSize: "0.95em",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: accent,
              borderBottom: "1px solid #111827",
              paddingBottom: "0.2em",
              marginBottom: "0.4em"
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#1f2937" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
