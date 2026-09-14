import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function CorporateBlueTimelineTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const muted = "#475569"; // Slate gray for descriptions
  const primaryColor = design.accent || "#1d4ed8"; // Corporate Blue default

  return (
    <div style={{ 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#0f172a", 
      fontSize: "10pt",
      lineHeight: 1.45
    }}>
      {/* Top Header Grid */}
      <header style={{ 
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "1.5em",
        borderBottom: `3px solid ${primaryColor}`,
        paddingBottom: "1em",
        marginBottom: `${design.spacing * 1.2}em`
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "2em", 
            fontWeight: 800, 
            letterSpacing: "-0.01em",
            color: "#0f172a",
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </div>
          {doc.headline && (
            <div style={{ 
              color: primaryColor, 
              fontWeight: 700, 
              fontSize: "0.95em", 
              marginTop: "0.2em",
              letterSpacing: "0.02em",
              textTransform: "uppercase"
            }}>
              {doc.headline}
            </div>
          )}
          <div style={{ 
            marginTop: "0.6em", 
            fontSize: "0.85em", 
            color: muted, 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.8em" 
          }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && <span style={{ marginRight: "0.8em", color: "#cbd5e1" }}>•</span>}
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
                border: `3px solid ${primaryColor}` 
              }} 
            />
          </div>
        )}
      </header>

      {/* Main Sections with Custom Timeline logic */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em` 
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
              marginBottom: "0.6em" 
            }}>
              {label(key)}
            </h2>

            {/* Custom Timeline for Experience / Education */}
            {key === "experience" && doc.experience?.length > 0 ? (
              <div style={{ 
                borderLeft: `2.5px solid ${hexToRgba(primaryColor, 0.4)}`, 
                paddingLeft: "1.1em", 
                marginLeft: "0.3em",
                display: "flex", 
                flexDirection: "column", 
                gap: "0.8em" 
              }}>
                {doc.experience.map((e, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* Timeline bullet */}
                    <span style={{ 
                      position: "absolute", 
                      left: "-1.45em", 
                      top: "0.2em", 
                      width: "0.65em", 
                      height: "0.65em", 
                      borderRadius: "50%", 
                      background: primaryColor,
                      border: "2px solid #fff"
                    }} />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{e.role || "Puesto"}</span>
                      <span style={{ color: muted, fontSize: "0.85em", fontWeight: 500, whiteSpace: "nowrap" }}>{e.period}</span>
                    </div>
                    <div style={{ color: primaryColor, fontSize: "0.88em", fontWeight: 600, marginTop: "0.05em" }}>
                      {[e.company, e.location].filter(Boolean).join(" · ")}
                    </div>
                    {e.description && (
                      <p style={{ color: muted, marginTop: "0.2em", lineHeight: 1.5, fontSize: "0.95em" }}>
                        {e.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : key === "education" && doc.education?.length > 0 ? (
              <div style={{ 
                borderLeft: `2.5px solid ${hexToRgba(primaryColor, 0.4)}`, 
                paddingLeft: "1.1em", 
                marginLeft: "0.3em",
                display: "flex", 
                flexDirection: "column", 
                gap: "0.7em" 
              }}>
                {doc.education.map((e, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* Timeline bullet */}
                    <span style={{ 
                      position: "absolute", 
                      left: "-1.45em", 
                      top: "0.2em", 
                      width: "0.65em", 
                      height: "0.65em", 
                      borderRadius: "50%", 
                      background: primaryColor,
                      border: "2px solid #fff"
                    }} />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{e.degree || "Título"}</span>
                      <span style={{ color: muted, fontSize: "0.85em", fontWeight: 500, whiteSpace: "nowrap" }}>{e.period}</span>
                    </div>
                    <div style={{ color: primaryColor, fontSize: "0.88em", fontWeight: 600, marginTop: "0.05em" }}>
                      {[e.school, e.location].filter(Boolean).join(" · ")}
                    </div>
                    {e.description && (
                      <p style={{ color: muted, marginTop: "0.25em", lineHeight: 1.5, fontSize: "0.95em" }}>
                        {e.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#334155" }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
