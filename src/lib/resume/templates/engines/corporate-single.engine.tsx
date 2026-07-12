/**
 * CorporateSingleEngine — Clean ATS-pure single-column layout.
 * Used by: Accountant, Financial Analyst, Bank Manager, Lawyer, Legal, HR, Recruiter, Government, Customer Service, Call Center, Receptionist, Admin, Office, Virtual, Security, Police, Factory, Manufacturing
 */
import type { TemplateProps } from "../../types";
import { visibleSections, FONT_STACKS } from "../../types";
import { renderSectionBody, label } from "../../blocks";
import { contactList } from "../../contact";

export type CorporateSingleConfig = {
  accent: string;
  headerBg?: string;
  headerTextColor?: string;
};

export function CorporateSingleEngine({ doc, design, layout }: TemplateProps, cfg?: CorporateSingleConfig) {
  const accent = cfg?.accent || design.accent || "#1d4ed8";
  const headerBg = cfg?.headerBg || accent;
  const headerText = cfg?.headerTextColor || "#fff";
  const sections = visibleSections(doc, layout);

  return (
    <div style={{
      fontFamily: FONT_STACKS[design.bodyFont], fontSize: "9.5pt",
      lineHeight: 1.45, color: "#1e293b", background: "#fff", minHeight: "100%",
    }}>
      {/* Top Header Bar */}
      <header style={{
        background: headerBg, color: headerText,
        padding: "1.6em 1.8em",
        display: "grid", gridTemplateColumns: doc.photo_url ? "auto 1fr" : "1fr",
        gap: "1.2em", alignItems: "center",
      }}>
        {doc.photo_url && (
          <img src={doc.photo_url} alt={doc.full_name} style={{
            width: "5em", height: "5em", borderRadius: "50%",
            objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)",
          }} />
        )}
        <div>
          <h1 style={{
            fontFamily: FONT_STACKS[design.headingFont], fontSize: "1.55em",
            fontWeight: 800, margin: 0, letterSpacing: "0.01em", color: headerText,
          }}>{doc.full_name || "Tu Nombre"}</h1>
          {doc.headline && (
            <p style={{ fontSize: "0.88em", fontWeight: 500, color: "rgba(255,255,255,0.85)", marginTop: "0.2em", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {doc.headline}
            </p>
          )}
          <p style={{ fontSize: "0.8em", color: "rgba(255,255,255,0.75)", marginTop: "0.5em" }}>
            {contactList(doc).join("  ·  ")}
          </p>
        </div>
      </header>

      {/* Accent rule */}
      <div style={{ height: "3px", background: `linear-gradient(to right, ${accent}, transparent)` }} />

      {/* Body */}
      <main style={{ padding: "1.4em 1.8em", display: "flex", flexDirection: "column", gap: `${design.spacing * 1.1}em` }}>
        {sections.map((key) => (
          <section key={key} style={{ pageBreakInside: "avoid" }}>
            <h2 style={{
              fontFamily: FONT_STACKS[design.headingFont], fontSize: "0.9em", fontWeight: 700,
              color: accent, textTransform: "uppercase", letterSpacing: "0.07em",
              borderBottom: `1.5px solid ${accent}`, paddingBottom: "0.2em", marginBottom: "0.5em",
            }}>
              {label(key)}
            </h2>
            {renderSectionBody(key, { doc, design: { ...design, accent }, muted: "#64748b" })}
          </section>
        ))}
      </main>
    </div>
  );
}
