import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR_SECTIONS: SectionKey[] = ["skills", "socials", "languages", "interests"];

export function MarketingPortfolioTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const sidebar = sections.filter((s) => SIDEBAR_SECTIONS.includes(s));
  const main = sections.filter((s) => !SIDEBAR_SECTIONS.includes(s));
  
  const primaryColor = design.accent || "#e11d48"; // Marketing Rose default
  const sidebarBg = hexToRgba(primaryColor, 0.04);
  const muted = "#475569"; // Slate gray

  return (
    <div style={{ display: "flex", fontFamily: FONT_STACKS[design.bodyFont], color: "#0f172a", fontSize: "10pt", minHeight: "100%" }}>
      {/* Left Sidebar */}
      <aside style={{
        width: "35%",
        background: sidebarBg,
        borderRight: `1px solid ${hexToRgba(primaryColor, 0.15)}`,
        padding: "1.8em 1.2em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box"
      }}>
        {doc.photo_url && (
          <div style={{ alignSelf: "center", width: "100%", marginBottom: "0.2em" }}>
            <img 
              src={doc.photo_url} 
              alt={doc.full_name} 
              style={{ 
                width: "100%", 
                aspectRatio: "3/4", 
                objectFit: "cover", 
                borderRadius: "8px", 
                border: `2px solid ${primaryColor}`,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
              }} 
            />
          </div>
        )}

        {/* Contact Info Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6em" }}>
          <h3 style={{ 
            fontSize: "0.78em", 
            textTransform: "uppercase", 
            letterSpacing: "0.1em", 
            color: primaryColor, 
            fontWeight: 700,
            margin: 0 
          }}>
            Contacto
          </h3>
          <div style={{ fontSize: "0.82em", display: "flex", flexDirection: "column", gap: "0.4em", color: "#334155" }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ wordBreak: "break-all" }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Sidebar Sections */}
        {sidebar.map((key) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.4em" }}>
            <h3 style={{ 
              fontSize: "0.78em", 
              textTransform: "uppercase", 
              letterSpacing: "0.1em", 
              color: primaryColor, 
              fontWeight: 700,
              margin: 0 
            }}>
              {label(key)}
            </h3>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </div>
        ))}
      </aside>

      {/* Right Main Column */}
      <main style={{ 
        flex: 1, 
        padding: "1.8em 1.5em", 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box"
      }}>
        {/* Name & Headline Block */}
        <header style={{ borderBottom: `2px solid ${hexToRgba(primaryColor, 0.15)}`, paddingBottom: "1.2em" }}>
          <h1 style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "2.1em", 
            fontWeight: 800, 
            letterSpacing: "-0.02em", 
            color: "#0f172a",
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </h1>
          {doc.headline && (
            <div style={{ 
              color: primaryColor, 
              fontWeight: 600, 
              fontSize: "1.05em", 
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
              fontSize: "1em", 
              fontWeight: 800, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: "#0f172a",
              marginBottom: "0.5em",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{ marginRight: "0.5em" }}>{label(key)}</span>
              <span style={{ flex: 1, height: "2px", background: hexToRgba(primaryColor, 0.15) }} />
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
