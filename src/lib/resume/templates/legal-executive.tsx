import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function LegalExecutiveTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#374151"; // Slightly darker, premium charcoal for text readability
  
  // We force Serif font for legal templates because it conveys authority, tradition and prestige
  const legalFontStack = FONT_STACKS["serif"];

  return (
    <div style={{ 
      fontFamily: legalFontStack, 
      color: "#000", 
      fontSize: "10.5pt",
      lineHeight: 1.5,
      padding: "0.2em 0.5em"
    }}>
      {/* Centered Traditional Header */}
      <header style={{ 
        textAlign: "center", 
        borderBottom: "1.5px solid #000",
        paddingBottom: "1.2em",
        marginBottom: `${design.spacing * 1.3}em`
      }}>
        <div style={{ 
          fontFamily: legalFontStack, 
          fontSize: "2.2em", 
          fontWeight: 500, 
          letterSpacing: "0.01em",
          color: "#000",
          margin: 0
        }}>
          {doc.full_name || "Tu Nombre"}
        </div>
        
        {doc.headline && (
          <div style={{ 
            fontFamily: legalFontStack,
            color: "#4b5563", 
            fontWeight: 400, 
            fontSize: "1em", 
            marginTop: "0.3em",
            fontStyle: "italic",
            letterSpacing: "0.02em"
          }}>
            {doc.headline}
          </div>
        )}
        
        <div style={{ 
          fontSize: "0.82em", 
          marginTop: "0.75em",
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          gap: "1.2em",
          color: "#4b5563"
        }}>
          {contactList(doc).map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && <span style={{ marginRight: "1.2em", color: "#cbd5e1" }}>•</span>}
              {c}
            </span>
          ))}
        </div>
      </header>

      {/* Main Single Column Sections */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em` 
      }}>
        {sections.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{ 
              fontFamily: legalFontStack, 
              fontSize: "1.05em", 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: "#000", 
              borderBottom: "0.5px solid #000", 
              paddingBottom: "0.2em", 
              marginBottom: "0.5em" 
            }}>
              {label(key)}
            </h2>
            <div style={{ 
              fontSize: "0.95em", 
              color: muted,
              paddingLeft: "0.2em"
            }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
