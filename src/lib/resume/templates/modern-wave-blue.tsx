import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, SkillBars, hexToRgba } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR_SECTIONS: SectionKey[] = ["skills", "languages", "education"];

export function ModernWaveBlueTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const sidebar = sections.filter((s) => SIDEBAR_SECTIONS.includes(s));
  const main = sections.filter((s) => !SIDEBAR_SECTIONS.includes(s) && s !== "summary");
  const hasSummary = sections.includes("summary");

  const primaryColor = design.accent || "#1e3a8a"; // Deep Navy Blue
  const secondaryColor = "#0284c7"; // Sky Blue
  const mutedText = "#475569"; // Slate gray

  return (
    <div style={{ 
      display: "flex", 
      fontFamily: FONT_STACKS[design.bodyFont], 
      color: "#0f172a", 
      fontSize: "9.8pt", 
      minHeight: "297mm", // Match A4 height exactly
      position: "relative",
      background: "#ffffff",
      overflow: "hidden"
    }}>
      {/* BACKGROUND SVG WAVE - TOP HEADER */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80mm", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 240" preserveAspectRatio="none">
          <path d="M -10 0 L 810 0 L 810 130 Q 600 210, 320 120 T -10 190 Z" fill="url(#topWaveGrad1)" opacity="0.15" />
          <path d="M -10 0 L 810 0 L 810 90 Q 550 170, 260 80 T -10 140 Z" fill="url(#topWaveGrad2)" opacity="0.9" />
          <defs>
            <linearGradient id="topWaveGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
            <linearGradient id="topWaveGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* BACKGROUND SVG WAVE - BOTTOM FOOTER */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40mm", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 120" preserveAspectRatio="none">
          <path d="M -10 120 L 810 120 L 810 30 Q 600 -20, 350 40 T -10 10 Z" fill="url(#botWaveGrad)" opacity="0.95" />
          <defs>
            <linearGradient id="botWaveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* LEFT COLUMN (SIDEBAR) */}
      <aside style={{
        width: "36%",
        padding: "2em 1.3em 3em 1.5em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1
      }}>
        {/* Photo Container */}
        {doc.photo_url ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginTop: "1.5em", 
            marginBottom: "0.5em" 
          }}>
            <img 
              src={doc.photo_url} 
              alt={doc.full_name} 
              style={{ 
                width: "7em", 
                height: "7em", 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: `5px solid ${primaryColor}`,
                boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                background: "#fff"
              }} 
            />
          </div>
        ) : (
          <div style={{ height: "6em" }} /> // Spacing matching header wave overlay
        )}

        {/* Contact Block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6em" }}>
          <h2 style={{ 
            fontSize: "0.95em", 
            fontWeight: 800, 
            textTransform: "uppercase", 
            letterSpacing: "0.08em", 
            color: primaryColor,
            borderBottom: `2.5px solid ${primaryColor}`,
            paddingBottom: "0.25em",
            margin: 0
          }}>
            Contacto
          </h2>
          <div style={{ fontSize: "0.82em", display: "flex", flexDirection: "column", gap: "0.55em", color: "#334155" }}>
            {doc.phone && <div>📞 {doc.phone}</div>}
            {doc.email && <div style={{ wordBreak: "break-all" }}>✉️ {doc.email}</div>}
            {doc.location && <div>📍 {doc.location}</div>}
            {doc.website && <div style={{ wordBreak: "break-all" }}>🌐 {doc.website}</div>}
          </div>
        </div>

        {/* Sidebar Sections */}
        {sidebar.map((key) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
            <h2 style={{ 
              fontSize: "0.95em", 
              fontWeight: 800, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: primaryColor,
              borderBottom: `2.5px solid ${primaryColor}`,
              paddingBottom: "0.25em",
              margin: 0
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#334155" }}>
              {key === "skills" ? (
                <SkillBars items={doc.skills} design={{ ...design, accent: primaryColor }} />
              ) : (
                renderSectionBody(key, { doc, design, muted: mutedText })
              )}
            </div>
          </div>
        ))}
      </aside>

      {/* RIGHT COLUMN (MAIN CONTENT) */}
      <main style={{ 
        flex: 1, 
        padding: "3.2em 1.6em 3em 1.2em", 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1
      }}>
        {/* Name & Headline Header */}
        <header style={{ paddingBottom: "0.6em", borderBottom: `2px solid ${primaryColor}` }}>
          <div style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "2.1em", 
            fontWeight: 800, 
            color: primaryColor, 
            letterSpacing: "-0.01em",
            margin: 0
          }}>
            {doc.full_name || "Tu Nombre"}
          </div>
          {doc.headline && (
            <div style={{ 
              color: mutedText, 
              fontWeight: 500, 
              fontSize: "1.1em", 
              marginTop: "0.25em",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {doc.headline}
            </div>
          )}
        </header>

        {/* Profile (Summary) at Top if exists */}
        {hasSummary && (
          <section style={{ pageBreakInside: "avoid" }}>
            <h2 style={{ 
              fontFamily: FONT_STACKS[design.headingFont], 
              fontSize: "1.05em", 
              fontWeight: 800, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: primaryColor,
              marginBottom: "0.45em"
            }}>
              Perfil
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody("summary", { doc, design, muted: mutedText })}
            </div>
          </section>
        )}

        {/* Main Content Sections */}
        {main.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{ 
              fontFamily: FONT_STACKS[design.headingFont], 
              fontSize: "1.05em", 
              fontWeight: 800, 
              textTransform: "uppercase", 
              letterSpacing: "0.08em", 
              color: primaryColor,
              marginBottom: "0.45em"
            }}>
              {label(key)}
            </h2>
            <div style={{ color: "#334155" }}>
              {renderSectionBody(key, { doc, design, muted: mutedText })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
