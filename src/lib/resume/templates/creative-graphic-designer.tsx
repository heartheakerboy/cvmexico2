import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label, hexToRgba } from "../blocks";
import { contactList } from "../contact";

export function CreativeGraphicDesignerTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#d946ef"; // Creative fuchsia/rose
  const muted = "#4b5563";

  // Split layout
  const sidebarKeys = ["skills", "languages", "socials", "interests"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#1e293b",
      fontSize: "9.5pt",
      lineHeight: 1.4,
      minHeight: "100%",
      display: "grid",
      gridTemplateColumns: "1.1fr 1.9fr",
      background: "#fff"
    }}>
      {/* Designer Sidebar with light lavender/grey background */}
      <aside style={{
        background: "#fdf8ff", // Soft rose/lavender background
        padding: "1.6em",
        display: "flex",
        flexDirection: "column",
        gap: "1.5em",
        borderRight: `2px solid ${hexToRgba(accent, 0.2)}`
      }}>
        {/* Soft rounded card for photo */}
        <div style={{ textAlign: "center" }}>
          {doc.photo_url ? (
            <img
              src={doc.photo_url}
              alt={doc.full_name}
              style={{
                width: "6.5em",
                height: "6.5em",
                objectFit: "cover",
                borderRadius: "1.2em", // Squircle style
                border: `3px solid ${accent}`,
                boxShadow: `0 4px 10px ${hexToRgba(accent, 0.15)}`,
                marginBottom: "1em",
                background: "#fff"
              }}
            />
          ) : (
            <div style={{
              width: "6.5em",
              height: "6.5em",
              borderRadius: "1.2em",
              border: `2px dashed ${accent}`,
              margin: "0 auto 1em auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent,
              fontSize: "0.8em"
            }}>
              Foto
            </div>
          )}
          
          <div style={{
            fontFamily: FONT_STACKS[design.headingFont],
            fontSize: "1.35em",
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 0.2em 0",
            lineHeight: 1.25
          }}>
            {doc.full_name || "Tu Nombre"}
          </div>
          <p style={{
            fontSize: "0.82em",
            color: accent,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0
          }}>
            {doc.headline || "Diseñador/a Creativo"}
          </p>
        </div>

        {/* Contact links */}
        <div style={{
          fontSize: "0.8em",
          color: "#475569",
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
          background: "#fff",
          padding: "1em",
          borderRadius: "0.8em",
          border: `1px solid ${hexToRgba(accent, 0.1)}`
        }}>
          {contactList(doc).map((c, i) => (
            <div key={i} className="truncate">
              <span style={{ color: accent, marginRight: "0.4em" }}>•</span>
              {c}
            </div>
          ))}
        </div>

        {/* Sidebar Sections */}
        {sections
          .filter((k) => sidebarKeys.includes(k))
          .map((key) => (
            <div key={key} style={{
              background: "#fff",
              padding: "1em",
              borderRadius: "0.8em",
              border: `1px solid ${hexToRgba(accent, 0.08)}`
            }}>
              <h3 style={{
                fontFamily: FONT_STACKS[design.headingFont],
                fontSize: "0.82em",
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 0.5em 0",
                display: "flex",
                alignItems: "center",
                gap: "0.3em"
              }}>
                <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: accent }} />
                {label(key)}
              </h3>
              <div style={{ fontSize: "0.88em", color: "#334155" }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            </div>
          ))}
      </aside>

      {/* Main Content Column */}
      <main style={{
        padding: "1.8em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.25}em`
      }}>
        {mainKeys.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont],
              fontSize: "1.1em",
              fontWeight: 800,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `2.5px solid ${hexToRgba(accent, 0.15)}`,
              paddingBottom: "0.25em",
              marginBottom: "0.5em"
            }}>
              <span>{label(key)}</span>
              <span style={{ color: accent, fontSize: "0.7em" }}>✦</span>
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
