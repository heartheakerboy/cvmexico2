import type { TemplateProps, SectionKey } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, SkillBars, hexToRgba } from "../blocks";
import { contactList } from "../contact";

const SIDEBAR_SECTIONS: SectionKey[] = ["skills", "languages", "certifications", "interests", "socials"];

export function PremiumExecutiveTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const sidebar = sections.filter((s) => SIDEBAR_SECTIONS.includes(s));
  const main = sections.filter((s) => !SIDEBAR_SECTIONS.includes(s));
  
  // Luxury Palette
  const bgDark = "#111827"; // Deep Black-slate
  const textGold = design.accent || "#d4af37"; // Gold accent
  const textLight = "#f3f4f6"; // White/gray
  const mutedLight = "#cbd5e1"; // Muted gray for dark bg
  const mutedDark = "#4b5563"; // Muted gray for light bg

  return (
    <div style={{ display: "flex", fontFamily: FONT_STACKS[design.bodyFont], color: "#1f2937", fontSize: "10pt", minHeight: "100%" }}>
      {/* Dark Sidebar */}
      <aside style={{
        width: "35%",
        background: bgDark,
        color: textLight,
        padding: "1.8em 1.3em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box"
      }}>
        {doc.photo_url && (
          <div style={{ alignSelf: "center", marginBottom: "0.5em" }}>
            <img 
              src={doc.photo_url} 
              alt={doc.full_name} 
              style={{ 
                width: "6.5em", 
                height: "6.5em", 
                objectFit: "cover", 
                borderRadius: "50%", 
                border: `3px solid ${textGold}`,
                boxShadow: `0 4px 10px ${hexToRgba(textGold, 0.3)}`
              }} 
            />
          </div>
        )}
        
        <div style={{ borderBottom: `1px solid ${hexToRgba(textGold, 0.4)}`, paddingBottom: "1em" }}>
          <div style={{ 
            fontFamily: FONT_STACKS[design.headingFont], 
            fontSize: "1.6em", 
            fontWeight: 700, 
            color: "#fff", 
            lineHeight: 1.1,
            letterSpacing: "0.02em"
          }}>
            {doc.full_name || "Tu Nombre"}
          </div>
          {doc.headline && (
            <div style={{ 
              color: textGold, 
              fontWeight: 600, 
              fontSize: "0.9em", 
              marginTop: "0.3em",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {doc.headline}
            </div>
          )}
        </div>

        {/* Contact info list with gold icons/dots */}
        <div style={{ fontSize: "0.82em", display: "flex", flexDirection: "column", gap: "0.5em", color: mutedLight }}>
          {contactList(doc).map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
              <span style={{ color: textGold, fontSize: "1.2em" }}>•</span>
              <span>{c}</span>
            </div>
          ))}
        </div>

        {/* Sidebar Sections */}
        {sidebar.map((key) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
            <h2 style={{ 
              fontSize: "0.85em", 
              textTransform: "uppercase", 
              letterSpacing: "0.15em", 
              color: textGold, 
              fontWeight: 700,
              borderBottom: `1px solid ${hexToRgba(textLight, 0.15)}`,
              paddingBottom: "0.25em"
            }}>
              {label(key)}
            </h2>
            {key === "skills" ? (
              <SkillBars items={doc.skills} design={{ ...design, accent: textGold }} />
            ) : (
              renderSectionBody(key, { doc, design, muted: mutedLight })
            )}
          </div>
        ))}
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: "1.8em 1.5em", 
        display: "flex", 
        flexDirection: "column", 
        gap: `${design.spacing * 1.2}em`,
        boxSizing: "border-box"
      }}>
        {main.map((key) => (
          <section key={key}>
            <h2 style={{ 
              fontFamily: FONT_STACKS[design.headingFont], 
              fontSize: "1.1em", 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: "0.1em", 
              color: bgDark, 
              borderBottom: `2px solid ${textGold}`, 
              paddingBottom: "0.2em", 
              marginBottom: "0.6em",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>{label(key)}</span>
              <span style={{ height: "4px", width: "12px", background: textGold, borderRadius: "2px" }} />
            </h2>
            <div style={{ color: "#374151" }}>
              {renderSectionBody(key, { doc, design, muted: mutedDark })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
