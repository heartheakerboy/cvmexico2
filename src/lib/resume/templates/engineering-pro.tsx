import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function EngineeringProTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563"; // Technical gray
  const primaryColor = design.accent || "#0891b2"; // Steel Cyan default
  const monoFont = FONT_STACKS["mono"];

  return (
    <div style={{ 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#0f172a", 
      fontSize: "9.5pt",
      lineHeight: 1.4
    }}>
      {/* Dev Header */}
      <header style={{ 
        borderBottom: `2px dashed ${primaryColor}`,
        paddingBottom: "1em",
        marginBottom: `${design.spacing * 1.2}em`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "2em", 
            fontWeight: 800, 
            color: "#0f172a",
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </div>
          
          {doc.headline && (
            <span style={{ 
              fontFamily: monoFont, 
              color: primaryColor, 
              fontWeight: 600, 
              fontSize: "0.85em",
              background: "rgba(8, 145, 178, 0.08)",
              padding: "0.2em 0.5em",
              borderRadius: "4px",
              border: `1px solid rgba(8, 145, 178, 0.2)`
            }}>
              {`// ${doc.headline}`}
            </span>
          )}
        </div>

        <div style={{ 
          fontFamily: monoFont,
          fontSize: "0.8em", 
          color: muted, 
          marginTop: "0.8em",
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1.2em" 
        }}>
          {contactList(doc).map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{ color: primaryColor, marginRight: "0.3em" }}>$</span>
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* Grid of Sections */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.15}em` 
      }}>
        {sections.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{ 
              fontFamily: monoFont, 
              fontSize: "0.85em", 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              color: primaryColor, 
              marginBottom: "0.5em",
              display: "flex",
              alignItems: "center",
              gap: "0.4em"
            }}>
              <span>{`> ${label(key)}`}</span>
              <span style={{ flex: 1, height: "1px", background: "rgba(0, 0, 0, 0.08)" }} />
            </h2>
            
            <div style={{ paddingLeft: "0.6em", color: "#1e293b" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
