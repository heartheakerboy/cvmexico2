import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function CreativeModernCircularTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#4b5563"; // Elegant gray for body text
  const primaryColor = design.accent || "#8b5cf6"; // Creative Violet default

  return (
    <div style={{ 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#1f2937", 
      fontSize: "10pt",
      lineHeight: 1.45
    }}>
      {/* Editorial Header */}
      <header style={{ 
        display: "flex", 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5em",
        borderBottom: `2px solid ${primaryColor}`, 
        paddingBottom: "1.2em",
        marginBottom: `${design.spacing * 1.3}em`
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "2.1em", 
            fontWeight: 800, 
            letterSpacing: "-0.02em",
            color: "#111827",
            lineHeight: 1.1,
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </h1>
          {doc.headline && (
            <div style={{ 
              color: primaryColor, 
              fontWeight: 600, 
              fontSize: "1em", 
              marginTop: "0.4em",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>
              {doc.headline}
            </div>
          )}
          <div style={{ 
            marginTop: "0.8em", 
            fontSize: "0.82em", 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.8em",
            color: muted 
          }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ 
                background: hexToRgba(primaryColor, 0.06), 
                color: "#1e1b4b",
                padding: "0.2em 0.6em", 
                borderRadius: "4px",
                fontWeight: 500
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
                width: "6.5em", 
                height: "6.5em", 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: `3px solid ${primaryColor}`,
                padding: "3px",
                background: "#fff"
              }} 
            />
          </div>
        )}
      </header>

      {/* Modern Grid Sections */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em` 
      }}>
        {sections.map((key) => (
          <section key={key} style={{ 
            display: "flex", 
            flexDirection: "row", 
            gap: "1.5em",
            pageBreakInside: "avoid"
          }}>
            {/* Left title column */}
            <div style={{ width: "22%", shrink: 0 }}>
              <h2 style={{ 
                fontFamily: FONT_STACKS[design.headingFont], 
                fontSize: "0.85em", 
                fontWeight: 800, 
                textTransform: "uppercase", 
                letterSpacing: "0.12em", 
                color: primaryColor, 
                marginTop: "0.15em",
                textAlign: "left"
              }}>
                {label(key)}
              </h2>
            </div>
            {/* Right content column */}
            <div style={{ 
              flex: 1, 
              borderLeft: `1px solid ${hexToRgba(primaryColor, 0.15)}`, 
              paddingLeft: "1.2em",
              color: "#374151"
            }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
