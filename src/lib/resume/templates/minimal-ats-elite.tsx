import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function MinimalAtsEliteTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563"; // Sane gray for descriptions
  
  return (
    <div style={{ 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#111827", 
      fontSize: "10pt", 
      lineHeight: 1.4 
    }}>
      {/* Centered Clean Header */}
      <header style={{ 
        textAlign: "center", 
        marginBottom: `${design.spacing * 1.2}em`,
        borderBottom: `1px solid ${design.accent || "#000"}`,
        paddingBottom: "1em"
      }}>
        <h1 style={{ 
          fontFamily: FONT_STACKS[design.headingFont], 
          fontSize: "1.9em", 
          fontWeight: 700, 
          letterSpacing: "0.02em",
          color: "#000",
          textTransform: "uppercase",
          margin: 0
        }}>
          {doc.full_name || "Tu Nombre"}
        </h1>
        
        {doc.headline && (
          <div style={{ 
            color: design.accent || "#3b82f6", 
            fontWeight: 600, 
            fontSize: "0.95em", 
            marginTop: "0.25em",
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}>
            {doc.headline}
          </div>
        )}
        
        <div style={{ 
          color: muted, 
          fontSize: "0.82em", 
          marginTop: "0.5em",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75em"
        }}>
          {contactList(doc).map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && <span style={{ margin: "0 0.5em", color: "#cbd5e1" }}>|</span>}
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* Main Single Column Sections */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.1}em` 
      }}>
        {sections.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{ 
              fontFamily: FONT_STACKS[design.headingFont], 
              fontSize: "0.9em", 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: design.accent || "#111827", 
              borderBottom: "1px solid #e5e7eb", 
              paddingBottom: "0.25em", 
              marginBottom: "0.45em" 
            }}>
              {label(key)}
            </h2>
            <div style={{ fontSize: "0.95em", color: "#374151" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
