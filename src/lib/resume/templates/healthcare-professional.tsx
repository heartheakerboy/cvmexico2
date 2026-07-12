import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function HealthcareProfessionalTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#3f3f46"; // Medical steel gray
  const primaryColor = design.accent || "#0d9488"; // Medical Teal default

  return (
    <div style={{ 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#18181b", 
      fontSize: "10pt",
      lineHeight: 1.45
    }}>
      {/* Clinical Header */}
      <header style={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        gap: "1.5em",
        borderBottom: `2.5px solid ${primaryColor}`,
        paddingBottom: "1em",
        marginBottom: `${design.spacing * 1.2}em`
      }}>
        {doc.photo_url && (
          <div style={{ shrink: 0 }}>
            <img 
              src={doc.photo_url} 
              alt={doc.full_name} 
              style={{ 
                width: "5.5em", 
                height: "5.5em", 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: `3px solid ${primaryColor}`,
                background: "#fff"
              }} 
            />
          </div>
        )}
        
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "1.85em", 
            fontWeight: 700, 
            letterSpacing: "0.01em",
            color: "#0f172a",
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </h1>
          {doc.headline && (
            <div style={{ 
              color: primaryColor, 
              fontWeight: 600, 
              fontSize: "0.95em", 
              marginTop: "0.2em",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}>
              {doc.headline}
            </div>
          )}
          <div style={{ 
            marginTop: "0.5em", 
            fontSize: "0.85em", 
            color: muted, 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.75em" 
          }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && <span style={{ marginRight: "0.75em", color: "#d4d4d8" }}>•</span>}
                {c}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Structured Sections */}
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
              color: primaryColor, 
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
              marginBottom: "0.5em"
            }}>
              {/* Clinical sidebar bar */}
              <span style={{ 
                display: "inline-block", 
                width: "4px", 
                height: "1.1em", 
                background: primaryColor, 
                borderRadius: "2px" 
              }} />
              {label(key)}
            </h2>
            
            <div style={{ 
              paddingLeft: "0.8em", 
              color: "#27272a" 
            }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
