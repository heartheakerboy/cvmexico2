/**
 * ExecutiveDualEngine — Premium serif two-column layout for management, engineering, education, hospitality, and trade roles.
 * Used by: Sales Manager, Business Dev, Teacher, Professor, Principal, Civil/Mechanical/Electrical Engineer, Architect, Construction, PM, Consultant, Entrepreneur, Real Estate, Chef, Retail, Logistics, etc.
 */
import type { TemplateProps, SectionKey } from "../../types";
import { visibleSections, FONT_STACKS } from "../../types";
import { renderSectionBody, label, hexToRgba, Chips } from "../../blocks";
import { contactList } from "../../contact";

export type ExecutiveDualConfig = {
  accent: string;
  topBorderColor?: string;
};

export function ExecutiveDualEngine({ doc, design, layout }: TemplateProps, cfg?: ExecutiveDualConfig) {
  const accent = cfg?.accent || design.accent || "#0f4c81";
  const topBorderColor = cfg?.topBorderColor || accent;
  const sections = visibleSections(doc, layout);
  const rightKeys: SectionKey[] = ["skills", "languages", "certifications", "awards", "references", "socials", "interests"];
  const leftKeys = sections.filter((k) => !rightKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont], fontSize: "9.5pt",
      lineHeight: 1.45, color: "#1e293b", background: "#fff", minHeight: "100%",
    }}>
      {/* Name banner */}
      <header style={{
        borderTop: `4px solid ${topBorderColor}`,
        padding: "1.4em 1.8em 1em",
        display: "grid",
        gridTemplateColumns: doc.photo_url ? "auto 1fr" : "1fr",
        gap: "1.2em", alignItems: "center",
      }}>
        {doc.photo_url && (
          <img src={doc.photo_url} alt={doc.full_name} style={{
            width: "5em", height: "5em", borderRadius: "0.4em",
            objectFit: "cover", border: `2px solid ${hexToRgba(accent, 0.3)}`,
          }} />
        )}
        <div>
          <div style={{
            fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.7em",
            fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.01em",
          }}>{doc.full_name || "Tu Nombre"}</div>
          {doc.headline && (
            <p style={{ fontSize: "0.9em", fontWeight: 600, color: accent, marginTop: "0.15em", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {doc.headline}
            </p>
          )}
          <p style={{ fontSize: "0.8em", color: "#64748b", marginTop: "0.4em" }}>
            {contactList(doc).join("  ·  ")}
          </p>
        </div>
      </header>

      <div style={{ height: "1px", background: hexToRgba(accent, 0.15), margin: "0 1.8em" }} />

      {/* Two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "1.2em", padding: "1.2em 1.8em" }}>
        {/* Left main */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
          {leftKeys.map((key) => (
            <section key={key} style={{ pageBreakInside: "avoid" }}>
              <h2 style={{
                fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.9em", fontWeight: 700,
                color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.07em",
                borderBottom: `1.5px solid ${accent}`, paddingBottom: "0.2em", marginBottom: "0.5em",
              }}>
                {label(key)}
              </h2>
              {renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#64748b" })}
            </section>
          ))}
        </div>

        {/* Right sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.2em" }}>
          {sections.filter((k) => rightKeys.includes(k)).map((key) => (
            <section key={key}>
              <h3 style={{
                fontSize: "0.75em", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.07em", color: accent,
                borderBottom: `1px solid ${hexToRgba(accent, 0.25)}`,
                paddingBottom: "0.2em", marginBottom: "0.4em",
              }}>
                {label(key)}
              </h3>
              <div style={{ fontSize: "0.88em", color: "#334155" }}>
                {key === "skills"
                  ? <Chips items={doc.skills} design={{ ...design, accent }} />
                  : renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#64748b" })}
              </div>
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
