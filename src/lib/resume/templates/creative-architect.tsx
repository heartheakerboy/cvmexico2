import type { TemplateProps } from "../types";
import { visibleSections, FONT_STACKS } from "../types";
import { renderSectionBody, label } from "../blocks";
import { contactList } from "../contact";

export function CreativeArchitectTemplate({ doc, design, layout }: TemplateProps) {
  const sections = visibleSections(doc, layout);
  const accent = design.accent || "#ea580c"; // Terracotta orange
  const muted = "#4b5563";

  // Sidebar components
  const sidebarKeys = ["skills", "languages", "socials", "interests"];
  const mainKeys = sections.filter((k) => !sidebarKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont],
      color: "#1f2937",
      fontSize: "9.5pt",
      lineHeight: 1.4,
      minHeight: "100%",
      display: "grid",
      gridTemplateColumns: "1.1fr 2fr",
      background: "#fff"
    }}>
      {/* Structural Left Column */}
      <aside style={{
        borderRight: "2px solid #111827",
        padding: "1.6em",
        display: "flex",
        flexDirection: "column",
        gap: "1.5em",
        background: "#fcfbf9" // Architectural draft paper tone
      }}>
        {/* Massive Bold Photo & Block */}
        <div>
          {doc.photo_url ? (
            <img
              src={doc.photo_url}
              alt={doc.full_name}
              style={{
                width: "100%",
                height: "11em",
                objectFit: "cover",
                border: "2px solid #111827",
                marginBottom: "1em",
                background: "#f3f4f6"
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "11em",
              border: "2px dashed #9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1em",
              fontSize: "0.8em",
              color: "#9ca3af"
            }}>
              [Espacio para Foto]
            </div>
          )}
        </div>

        {/* Contact details */}
        <div style={{
          fontSize: "0.8em",
          color: "#374151",
          display: "flex",
          flexDirection: "column",
          gap: "0.6em",
          borderBottom: "1.5px solid #111827",
          paddingBottom: "1em"
        }}>
          {contactList(doc).map((c, i) => (
            <div key={i} style={{ wordBreak: "break-all" }}>
              <strong style={{ color: accent, marginRight: "0.3em" }}>■</strong>
              {c}
            </div>
          ))}
        </div>

        {/* Sidebar sections */}
        {sections
          .filter((k) => sidebarKeys.includes(k))
          .map((key) => (
            <div key={key} style={{ borderBottom: "1.5px solid #111827", paddingBottom: "1em" }}>
              <h3 style={{
                fontFamily: FONT_STACKS[design.headingFont],
                fontSize: "0.85em",
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 0.5em 0"
              }}>
                {label(key)}
              </h3>
              <div style={{ fontSize: "0.88em", color: "#4b5563" }}>
                {renderSectionBody(key, { doc, design, muted })}
              </div>
            </div>
          ))}
      </aside>

      {/* Main Right Column */}
      <main style={{
        padding: "1.8em",
        display: "flex",
        flexDirection: "column",
        gap: `${design.spacing * 1.25}em`
      }}>
        {/* Name and headline as structural block */}
        <div style={{
          borderBottom: "4px solid #111827",
          paddingBottom: "1em",
          marginBottom: "0.5em"
        }}>
          <div style={{
            fontFamily: FONT_STACKS[design.headingFont],
            fontSize: "2em",
            fontWeight: 800,
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            margin: 0,
            lineHeight: 1.1
          }}>
            {doc.full_name || "Nombre Completo"}
          </div>
          {doc.headline && (
            <p style={{
              color: accent,
              fontSize: "0.95em",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0.3em 0 0 0"
            }}>
              {doc.headline}
            </p>
          )}
        </div>

        {/* Main Column sections */}
        {mainKeys.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont],
              fontSize: "1.05em",
              fontWeight: 700,
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "0.2em",
              marginBottom: "0.5em"
            }}>
              <span>{label(key)}</span>
              <span style={{ color: accent, fontSize: "0.8em" }}>┼</span>
            </h2>
            <div style={{ color: "#374151" }}>
              {renderSectionBody(key, { doc, design, muted })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
