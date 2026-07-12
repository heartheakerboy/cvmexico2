import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function StudentSuccessTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#475569"; // Slate gray for descriptions
  const primaryColor = design.accent || "#4f46e5"; // Indigo Blue default

  return (
    <div style={{ 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#1e293b", 
      fontSize: "10pt",
      lineHeight: 1.45
    }}>
      {/* Fresh Student Header */}
      <header style={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        gap: "1.5em",
        border: `1.5px solid ${hexToRgba(primaryColor, 0.25)}`,
        background: hexToRgba(primaryColor, 0.03),
        borderRadius: "12px",
        padding: "1.2em",
        marginBottom: `${design.spacing * 1.2}em`
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "1.85em", 
            fontWeight: 800, 
            letterSpacing: "-0.01em",
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
              letterSpacing: "0.02em"
            }}>
              {doc.headline}
            </div>
          )}
          <div style={{ 
            marginTop: "0.6em", 
            fontSize: "0.82em", 
            color: muted, 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.75em" 
          }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ 
                background: "#fff", 
                border: "1px solid #e2e8f0", 
                padding: "0.15em 0.5em", 
                borderRadius: "6px" 
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {doc.photo_url && (
          <div style={{ shrink: 0 }}>
            <img 
              src={doc.photo_url} 
              alt={doc.full_name} 
              style={{ 
                width: "5.8em", 
                height: "5.8em", 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: `3px solid ${primaryColor}`,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
              }} 
            />
          </div>
        )}
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
              letterSpacing: "0.08em", 
              color: primaryColor, 
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
              marginBottom: "0.45em"
            }}>
              {label(key)}
              <span style={{ 
                flex: 1, 
                height: "2px", 
                background: `linear-gradient(90deg, ${hexToRgba(primaryColor, 0.25)} 0%, rgba(255,255,255,0) 100%)` 
              }} />
            </h2>
            
            <div style={{ 
              paddingLeft: "0.4em", 
              color: "#334155" 
            }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
