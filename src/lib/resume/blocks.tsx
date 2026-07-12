import type { ReactElement } from "react";
import type { ResumeDoc, Design, SectionKey } from "./types";
import { SECTION_LABELS } from "./types";

// Shared, style-agnostic renderers for each section's BODY content.
// Templates provide their own heading + wrapper styling and simply drop
// the matching body renderer inside. This keeps item markup consistent
// while letting each template own its visual identity.

type Ctx = { doc: ResumeDoc; design: Design; muted: string };

export function renderSectionBody(key: SectionKey, ctx: Ctx): ReactElement | null {
  const { doc, design, muted } = ctx;
  switch (key) {
    case "summary":
      return <p style={{ color: muted, lineHeight: 1.55 }}>{doc.summary}</p>;

    case "experience":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55em" }}>
          {doc.experience.map((e, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
                <span style={{ fontWeight: 600 }}>{e.role || "Puesto"}</span>
                <span style={{ color: muted, fontSize: "0.85em", whiteSpace: "nowrap" }}>{e.period}</span>
              </div>
              <div style={{ color: design.accent, fontSize: "0.9em", fontWeight: 500 }}>
                {[e.company, e.location].filter(Boolean).join(" · ")}
              </div>
              {e.description && (
                <p style={{ color: muted, marginTop: "0.15em", lineHeight: 1.5 }}>{e.description}</p>
              )}
            </div>
          ))}
        </div>
      );

    case "education":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
          {doc.education.map((e, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
                <span style={{ fontWeight: 600 }}>{e.degree || "Título"}</span>
                <span style={{ color: muted, fontSize: "0.85em", whiteSpace: "nowrap" }}>{e.period}</span>
              </div>
              <div style={{ color: design.accent, fontSize: "0.9em" }}>
                {[e.school, e.location].filter(Boolean).join(" · ")}
              </div>
              {e.description && (
                <p style={{ color: muted, marginTop: "0.15em", lineHeight: 1.5 }}>{e.description}</p>
              )}
            </div>
          ))}
        </div>
      );

    case "skills":
      return <Chips items={doc.skills} design={design} />;

    case "projects":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
          {doc.projects.map((p, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
                <span style={{ fontWeight: 600 }}>{p.name || "Proyecto"}</span>
                <span style={{ color: muted, fontSize: "0.85em" }}>{p.period}</span>
              </div>
              {p.description && <p style={{ color: muted, lineHeight: 1.5 }}>{p.description}</p>}
              {p.link && <span style={{ color: design.accent, fontSize: "0.85em" }}>{p.link}</span>}
            </div>
          ))}
        </div>
      );

    case "languages":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3em" }}>
          {doc.languages.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
              <span style={{ fontWeight: 500 }}>{l.name}</span>
              <span style={{ color: muted, fontSize: "0.85em" }}>{l.level}</span>
            </div>
          ))}
        </div>
      );

    case "certifications":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35em" }}>
          {doc.certifications.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
              <span style={{ fontWeight: 500 }}>
                {c.name}
                {c.issuer && <span style={{ color: muted, fontWeight: 400 }}> — {c.issuer}</span>}
              </span>
              <span style={{ color: muted, fontSize: "0.85em" }}>{c.year}</span>
            </div>
          ))}
        </div>
      );

    case "awards":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35em" }}>
          {doc.awards.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1em" }}>
              <span style={{ fontWeight: 500 }}>
                {a.name}
                {a.issuer && <span style={{ color: muted, fontWeight: 400 }}> — {a.issuer}</span>}
              </span>
              <span style={{ color: muted, fontSize: "0.85em" }}>{a.year}</span>
            </div>
          ))}
        </div>
      );

    case "references":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5em" }}>
          {doc.references.map((r, i) => (
            <div key={i}>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: muted, fontSize: "0.85em" }}>{r.relation}</div>
              <div style={{ color: muted, fontSize: "0.85em" }}>{r.contact}</div>
            </div>
          ))}
        </div>
      );

    case "interests":
      return <Chips items={doc.interests} design={design} soft />;

    case "socials":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25em" }}>
          {doc.socials.map((s, i) => (
            <div key={i} style={{ fontSize: "0.9em" }}>
              <span style={{ fontWeight: 500 }}>{s.label}: </span>
              <span style={{ color: design.accent }}>{s.url}</span>
            </div>
          ))}
        </div>
      );
  }
}

export function Chips({
  items,
  design,
  soft = false,
}: {
  items: string[];
  design: Design;
  soft?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em" }}>
      {items.map((s, i) => (
        <span
          key={i}
          style={{
            padding: "0.15em 0.6em",
            borderRadius: "999px",
            fontSize: "0.85em",
            background: soft ? "rgba(0,0,0,0.05)" : hexToRgba(design.accent, 0.12),
            color: soft ? "inherit" : design.accent,
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export function SkillBars({ items, design }: { items: string[]; design: Design }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45em" }}>
      {items.map((s, i) => (
        <div key={i}>
          <div style={{ fontSize: "0.85em", marginBottom: "0.2em" }}>{s}</div>
          <div style={{ height: "0.35em", borderRadius: "999px", background: "rgba(255,255,255,0.25)" }}>
            <div
              style={{
                height: "100%",
                width: `${70 + ((i * 7) % 30)}%`,
                borderRadius: "999px",
                background: design.accent,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function label(key: SectionKey): string {
  return SECTION_LABELS[key];
}

export function hexToRgba(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return hex;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}