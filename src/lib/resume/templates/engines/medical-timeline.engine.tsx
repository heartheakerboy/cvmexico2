/**
 * MedicalTimelineEngine — Credentials-focused layout with a clean timeline, used for healthcare and science roles.
 * Used by: Registered Nurse, Medical Assistant, Doctor, Dentist, Pharmacist, Psychologist, Counselor, Veterinarian, Fitness Trainer
 */
import type { TemplateProps, SectionKey } from "../../types";
import { visibleSections, FONT_STACKS } from "../../types";
import { renderSectionBody, label, hexToRgba } from "../../blocks";
import { contactList } from "../../contact";

export type MedicalTimelineConfig = {
  accent: string;
  headerColor?: string;
};

export function MedicalTimelineEngine({ doc, design, layout }: TemplateProps, cfg?: MedicalTimelineConfig) {
  const accent = cfg?.accent || design.accent || "#0d9488";
  const headerColor = cfg?.headerColor || "#f0fdfa";
  const sections = visibleSections(doc, layout);
  const credentialKeys: SectionKey[] = ["certifications", "awards", "languages"];
  const mainKeys = sections.filter((k) => !credentialKeys.includes(k));
  const credKeys = sections.filter((k) => credentialKeys.includes(k));

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont], fontSize: "9.5pt",
      lineHeight: 1.45, color: "#1e293b", background: "#fff", minHeight: "100%",
    }}>
      {/* Header */}
      <header style={{ background: headerColor, borderBottom: `3px solid ${accent}`, padding: "1.4em 1.8em" }}>
        <div style={{ display: "grid", gridTemplateColumns: doc.photo_url ? "auto 1fr auto" : "1fr auto", gap: "1.2em", alignItems: "start" }}>
          {doc.photo_url && (
            <img src={doc.photo_url} alt={doc.full_name} style={{
              width: "5em", height: "5em", borderRadius: "50%",
              objectFit: "cover", border: `2px solid ${accent}`,
            }} />
          )}
          <div>
            <div style={{
              fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.5em",
              fontWeight: 800, margin: 0, color: "#0f172a",
            }}>{doc.full_name || "Tu Nombre"}</div>
            {doc.headline && (
              <p style={{ fontSize: "0.88em", fontWeight: 600, color: accent, marginTop: "0.2em" }}>
                {doc.headline}
              </p>
            )}
          </div>
          {/* Credential chips at top right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3em", alignItems: "flex-end" }}>
            {contactList(doc).map((c, i) => (
              <span key={i} style={{ fontSize: "0.8em", color: "#64748b" }}>{c}</span>
            ))}
          </div>
        </div>
      </header>

      {/* Two columns: main timeline + credentials sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 0, padding: "1.4em 1.8em", paddingRight: 0 }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em`, paddingRight: "1.4em" }}>
          {mainKeys.map((key) => (
            <section key={key} style={{ pageBreakInside: "avoid", position: "relative", paddingLeft: "1.2em" }}>
              {/* Timeline dot */}
              <div style={{
                position: "absolute", left: 0, top: "0.2em",
                width: "0.6em", height: "0.6em", borderRadius: "50%",
                background: accent, border: "2px solid #fff",
                boxShadow: `0 0 0 2px ${accent}`,
              }} />
              <h2 style={{
                fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.9em", fontWeight: 700,
                color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em",
                borderBottom: `1.5px solid ${hexToRgba(accent, 0.25)}`,
                paddingBottom: "0.2em", marginBottom: "0.5em",
              }}>
                {label(key)}
              </h2>
              {renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#64748b" })}
            </section>
          ))}
        </div>

        {/* Credentials sidebar */}
        <aside style={{
          borderLeft: `2px solid ${hexToRgba(accent, 0.2)}`,
          background: hexToRgba(accent, 0.04),
          padding: "1em 1.2em",
          display: "flex", flexDirection: "column", gap: "1.2em",
        }}>
          {credKeys.map((key) => (
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
                {renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#64748b" })}
              </div>
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}
