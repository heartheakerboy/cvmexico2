import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR_SECTIONS: SectionKey[] = ["skills", "languages", "interests", "socials"];

export function CreativePremiumPlusTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const sidebar = sections.filter((s) => SIDEBAR_SECTIONS.includes(s));
  const main = sections.filter((s) => !SIDEBAR_SECTIONS.includes(s));
  
  const accentColor = design.accent || "#0ea5e9"; // Designer Blue default
  const sidebarBg = accentColor;
  const mutedLight = "rgba(255, 255, 255, 0.85)";
  const mutedDark = "#4b5563";

  return (
    <div style={{ display: "flex", fontFamily: FONT_STACKS[design.bodyFont], color: "#1e293b", fontSize: "10pt", minHeight: "100%" }}>
      {/* Accent-Colored Sidebar */}
      <aside style={{
        width: "34%",
        background: sidebarBg,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box"
      }}>
        {/* Large Portrait Photo at the top of the sidebar */}
        {doc.photo_url ? (
          <div style={{ width: "100%" }}>
            <img 
              src={doc.photo_url} 
              alt={doc.full_name} 
              style={{ 
                width: "100%", 
                aspectRatio: "1", 
                objectFit: "cover" 
              }} 
            />
          </div>
        ) : (
          <div style={{ height: "1.5em" }} /> // Spacing if no photo
        )}

        <div style={{ 
          padding: "0 1.2em 1.5em 1.2em", 
          display: "flex", 
          flexDirection: "column", 
          gap: `${design.spacing * 1.2}em` 
        }}>
          {/* Contact Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
            <h3 style={{ 
              fontSize: "0.8em", 
              textTransform: "uppercase", 
              letterSpacing: "0.1em", 
              color: "#fff",
              fontWeight: 700,
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              paddingBottom: "0.2em",
              margin: 0
            }}>
              Contacto
            </h3>
            <div style={{ fontSize: "0.82em", display: "flex", flexDirection: "column", gap: "0.35em", color: mutedLight }}>
              {contactList(doc).map((c, i) => (
                <span key={i} style={{ wordBreak: "break-all" }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Sidebar Sections */}
          {sidebar.map((key) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.4em" }}>
              <h3 style={{ 
                fontSize: "0.8em", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em", 
                color: "#fff",
                fontWeight: 700,
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: "0.2em",
                margin: 0
              }}>
                {label(key)}
              </h3>
              <div style={{ color: "#fff" }}>
                {renderSectionBody(key, { doc, design: { ...design, accent: "#fff" }, muted: mutedLight })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Column */}
      <main style={{ 
        flex: 1, 
        padding: "1.8em 1.5em", 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box"
      }}>
        {/* Name and headline header */}
        <header style={{ marginBottom: "0.4em" }}>
          <h1 style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "2.2em", 
            fontWeight: 800, 
            letterSpacing: "-0.02em", 
            color: "#0f172a",
            lineHeight: 1.1,
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </h1>
          {doc.headline && (
            <div style={{ 
              color: accentColor, 
              fontWeight: 700, 
              fontSize: "1.1em", 
              marginTop: "0.3em",
              letterSpacing: "0.02em"
            }}>
              {doc.headline}
            </div>
          )}
        </header>

        {/* Main Content Sections */}
        {main.map((key) => (
          <section key={key}>
            <h2 style={{ 
              fontFamily: FONT_STACKS[design.headingFont], 
              fontSize: "1.05em", 
              fontWeight: 800, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: "#0f172a",
              borderBottom: `2.5px solid ${accentColor}`,
              paddingBottom: "0.2em",
              marginBottom: "0.5em"
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design, muted: mutedDark })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
