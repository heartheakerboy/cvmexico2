import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function CorporateAccountantTemplate({ doc, design, layout }: TemplateProps) {
  // Always enforce single column for Accountant ATS layout
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#1e3a8a"; // Slate Navy
  const muted = "#4b5563";

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#111827",
      fontSize: "9.5pt",
      lineHeight: 1.4,
      background: "#fff"
    }}>
      {/* ATS Header (No Photo) */}
      <header style={{
        marginBottom: `${design.spacing * 1.1}em`,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: "0.8em"
      }}>
        <div style={{
          fontFamily: FONT_STACKS[design.headingFont],
          fontSize: "1.8em",
          fontWeight: 700,
          color: "#0f172a",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          margin: 0
        }}>
          {doc.full_name || "Nombre Completo"}
        </div>
        
        {doc.headline && (
          <div style={{
            color: accent,
            fontWeight: 600,
            fontSize: "0.95em",
            marginTop: "0.2em",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
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
              letterSpacing: "0.07em",
              color: accent,
              borderBottom: "1.5px solid #f1f5f9",
              paddingBottom: "0.2em",
              marginBottom: "0.45em"
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#374151" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
