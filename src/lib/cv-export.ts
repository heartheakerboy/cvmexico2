/**
 * Export utilities for CV: PDF (oklch-safe) and DOCX
 */

// ---------------------------------------------------------------------------
// OKLCH → RGB conversion (so html2canvas / jsPDF don't choke)
// ---------------------------------------------------------------------------

/** Convert oklch(l c h) to rgb(r g b) inline in a CSS string */
function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  // Convert to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab → LMS (via M2 inverse)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const lv = l_ * l_ * l_;
  const mv = m_ * m_ * m_;
  const sv = s_ * s_ * s_;

  // LMS → sRGB linear (via M1 inverse)
  const rLin =  4.0767416621 * lv - 3.3077115913 * mv + 0.2309699292 * sv;
  const gLin = -1.2684380046 * lv + 2.6097574011 * mv - 0.3413193965 * sv;
  const bLin = -0.0041960863 * lv - 0.7034186147 * mv + 1.7076147010 * sv;

  // Gamma-encode (sRGB)
  const toSrgb = (x: number) => {
    const c = Math.max(0, Math.min(1, x));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  return [
    Math.round(toSrgb(rLin) * 255),
    Math.round(toSrgb(gLin) * 255),
    Math.round(toSrgb(bLin) * 255),
  ];
}

/** Walk all stylesheets + inline styles and replace oklch() with rgb() */
export function fixOklchColors(root: HTMLElement = document.documentElement) {
  // Patch computed styles on all elements inside the print area
  const all = root.querySelectorAll("*");
  const oklchRe = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/gi;

  const replacer = (match: string, lStr: string, cStr: string, hStr: string) => {
    const l = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
    const c = parseFloat(cStr);
    const h = parseFloat(hStr);
    const [r, g, b] = oklchToRgb(l, c, h);
    return `rgb(${r},${g},${b})`;
  };

  // Also patch all linked/embedded stylesheets by cloning a <style> tag
  const styleEl = document.createElement("style");
  styleEl.id = "__oklch_patch__";
  const patches: string[] = [];

  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      Array.from(sheet.cssRules ?? []).forEach((rule) => {
        const text = rule.cssText;
        if (text.includes("oklch")) {
          patches.push(text.replace(oklchRe, replacer));
        }
      });
    } catch {
      // Cross-origin sheets — skip
    }
  });

  styleEl.textContent = patches.join("\n");
  document.head.appendChild(styleEl);

  // Also patch inline styles
  all.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style?.cssText?.includes("oklch")) {
      htmlEl.style.cssText = htmlEl.style.cssText.replace(oklchRe, replacer);
    }
  });

  // Return cleanup function
  return () => {
    document.getElementById("__oklch_patch__")?.remove();
  };
}

// ---------------------------------------------------------------------------
// PDF export
// ---------------------------------------------------------------------------

const COLOR_PROPS = [
  "color", "background-color", "border-color", "border-top-color",
  "border-right-color", "border-bottom-color", "border-left-color",
  "outline-color", "fill", "stroke", "caret-color",
  "text-decoration-color", "column-rule-color",
];

/**
 * Pre-inject computed (browser-resolved) color values as inline styles.
 * This ensures html2canvas sees plain rgb() values instead of oklch() / CSS vars.
 * Returns a restore function.
 */
function injectComputedColors(root: HTMLElement): () => void {
  const restoreList: Array<{ el: HTMLElement; prop: string; prev: string }> = [];
  const oklchRe = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/gi;
  const replacer = (match: string, lStr: string, cStr: string, hStr: string) => {
    const l = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
    const c = parseFloat(cStr);
    const h = parseFloat(hStr);
    const [r, g, b] = oklchToRgb(l, c, h);
    return `rgb(${r},${g},${b})`;
  };

  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const computed = getComputedStyle(el);
    COLOR_PROPS.forEach((prop) => {
      let val = computed.getPropertyValue(prop).trim();
      if (val && val !== "transparent" && val !== "rgba(0, 0, 0, 0)") {
        if (val.includes("oklch")) {
          val = val.replace(oklchRe, replacer);
        }
        restoreList.push({ el, prop, prev: el.style.getPropertyValue(prop) });
        el.style.setProperty(prop, val, "important");
      }
    });

    // Also force white background if element has no background set
    const bg = computed.getPropertyValue("background-color").trim();
    if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") {
      // Don't override — leave transparent so parent bg shows through
    }
  });

  // Force white bg on the root element itself
  const prevRootBg = root.style.getPropertyValue("background-color");
  let rootBg = getComputedStyle(root).getPropertyValue("background-color").trim();
  if (rootBg.includes("oklch")) {
    rootBg = rootBg.replace(oklchRe, replacer);
  }
  if (!rootBg || rootBg === "rgba(0, 0, 0, 0)" || rootBg === "transparent") {
    root.style.setProperty("background-color", "#ffffff", "important");
    restoreList.push({ el: root, prop: "background-color", prev: prevRootBg });
  }

  return () => {
    restoreList.forEach(({ el, prop, prev }) => {
      if (prev) el.style.setProperty(prop, prev);
      else el.style.removeProperty(prop);
    });
  };
}

export async function exportToPdf(elementId: string, _fileName: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Preview element not found");

  const oklchRe = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/gi;
  const replacer = (_m: string, lS: string, cS: string, hS: string) => {
    const l = lS.endsWith("%") ? parseFloat(lS) / 100 : parseFloat(lS);
    const [r, g, b] = oklchToRgb(l, parseFloat(cS), parseFloat(hS));
    return `rgb(${r},${g},${b})`;
  };

  // Find all stylesheets that contain oklch()
  const styleAndLinkTags = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"));
  const tagsToReplace: HTMLElement[] = [];

  styleAndLinkTags.forEach(tag => {
    const htmlTag = tag as HTMLElement;
    if (htmlTag.tagName === "STYLE") {
      if (htmlTag.textContent?.includes("oklch")) {
        tagsToReplace.push(htmlTag);
      } else {
        try {
          const sheet = (htmlTag as HTMLStyleElement).sheet;
          if (sheet) {
            let hasOklch = false;
            for (const rule of Array.from(sheet.cssRules ?? [])) {
              if (rule.cssText.includes("oklch")) {
                hasOklch = true;
                break;
              }
            }
            if (hasOklch) {
              tagsToReplace.push(htmlTag);
            }
          }
        } catch {
          // Ignore
        }
      }
    } else if (htmlTag.tagName === "LINK") {
      const linkEl = htmlTag as HTMLLinkElement;
      try {
        const sheet = linkEl.sheet;
        if (sheet) {
          let hasOklch = false;
          for (const rule of Array.from(sheet.cssRules ?? [])) {
            if (rule.cssText.includes("oklch")) {
              hasOklch = true;
              break;
            }
          }
          if (hasOklch) {
            tagsToReplace.push(linkEl);
          }
        }
      } catch {
        // Cross-origin stylesheet — do not replace it (likely doesn't have oklch anyway)
      }
    }
  });

  // Create an oklch-free CSS bundle of the replaced stylesheets
  let bundledCss = "";
  tagsToReplace.forEach(tag => {
    const htmlTag = tag as HTMLStyleElement | HTMLLinkElement;
    try {
      const sheet = htmlTag.sheet;
      if (sheet) {
        for (const rule of Array.from(sheet.cssRules ?? [])) {
          bundledCss += rule.cssText + "\n";
        }
      } else {
        bundledCss += htmlTag.textContent + "\n";
      }
    } catch {
      bundledCss += htmlTag.textContent + "\n";
    }
  });

  const patchedCss = bundledCss.replace(oklchRe, replacer);

  // Create our clean, oklch-free style tag
  const tempStyle = document.createElement("style");
  tempStyle.id = "__temp_pdf_style__";
  tempStyle.textContent = patchedCss;
  document.head.appendChild(tempStyle);

  // Temporarily replace original style tags with comment placeholders
  const savedTags = tagsToReplace.map(tag => {
    const parent = tag.parentNode;
    if (!parent) return null;
    const placeholder = document.createComment("style-placeholder");
    parent.replaceChild(placeholder, tag);
    return { tag, placeholder, parent };
  }).filter(Boolean) as Array<{ tag: HTMLElement; placeholder: Comment; parent: Node }>;

  // Also inject computed inline colors on the target element tree for safety
  const restoreColors = injectComputedColors(element as HTMLElement);

  // Temporarily override the display properties of the preview container
  const prevDisplay = element.style.display;
  const prevPosition = element.style.position;
  const prevLeft = element.style.left;
  const prevVisibility = element.style.visibility;

  element.style.setProperty("display", "block", "important");
  element.style.setProperty("position", "absolute", "important");
  element.style.setProperty("left", "-9999px", "important");
  element.style.setProperty("visibility", "visible", "important");

  try {
    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // A4 dimensions in points (1pt = 1/72 inch; A4 = 210 x 297 mm)
    const A4_W_PT = 595.28;
    const A4_H_PT = 841.89;

    const isLandscape = canvas.width > canvas.height;
    const pageW = isLandscape ? A4_H_PT : A4_W_PT;
    const pageH = isLandscape ? A4_W_PT : A4_H_PT;

    const imgAspect = canvas.height / canvas.width;
    const imgW = pageW;
    const imgH = pageW * imgAspect;

    const pdf = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "pt",
      format: "a4",
    });

    if (imgH <= pageH) {
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgW, imgH);
    } else {
      // Multi-page pagination
      const pxPerPt = canvas.width / pageW;
      const pageHeightPx = pageH * pxPerPt;
      let offsetPx = 0;
      let firstPage = true;

      while (offsetPx < canvas.height) {
        if (!firstPage) pdf.addPage();
        firstPage = false;

        const sliceH = Math.min(pageHeightPx, canvas.height - offsetPx);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, -offsetPx);

        pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageW, sliceH / pxPerPt);
        offsetPx += pageHeightPx;
      }
    }

    return pdf.output("blob");
  } finally {
    // Restore element style
    if (prevDisplay) element.style.setProperty("display", prevDisplay);
    else element.style.removeProperty("display");

    if (prevPosition) element.style.setProperty("position", prevPosition);
    else element.style.removeProperty("position");

    if (prevLeft) element.style.setProperty("left", prevLeft);
    else element.style.removeProperty("left");

    if (prevVisibility) element.style.setProperty("visibility", prevVisibility);
    else element.style.removeProperty("visibility");

    // Restore original style tags in the DOM
    savedTags.forEach(({ tag, placeholder, parent }) => {
      parent.replaceChild(tag, placeholder);
    });
    tempStyle.remove();
    restoreColors();
  }
}


// ---------------------------------------------------------------------------
// DOCX export
// ---------------------------------------------------------------------------
import type { ResumeDoc, Design } from "@/lib/resume/types";

function hex(color: string) {
  // Strip # for docx
  return color.replace("#", "");
}

function cmTwip(cm: number) {
  // 1 cm = 567 twips
  return Math.round(cm * 567);
}

export async function exportToDocx(doc: ResumeDoc, design: Design, title: string): Promise<void> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, Table, TableRow, TableCell,
    WidthType, ShadingType, VerticalAlign,
  } = await import("docx");

  const accentHex = hex(design.accent);
  const marginTwip = cmTwip((design.margin ?? 14) / 10);

  const makeDivider = () =>
    new Paragraph({
      border: { bottom: { color: accentHex, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      spacing: { after: 120 },
    });

  const makeSection = (heading: string, children: any[]) => [
    new Paragraph({
      text: heading.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      thematicBreak: false,
      spacing: { before: 240, after: 60 },
      run: { color: accentHex, bold: true, size: 22 },
    }),
    makeDivider(),
    ...children,
  ];

  const paras: any[] = [];

  // Header
  paras.push(
    new Paragraph({
      children: [new TextRun({ text: doc.full_name || title, bold: true, size: 36, color: accentHex })],
      alignment: AlignmentType.CENTER,
    }),
  );
  if (doc.headline) {
    paras.push(
      new Paragraph({
        children: [new TextRun({ text: doc.headline, size: 22, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }),
    );
  }
  const contactParts = [doc.email, doc.phone, doc.location, doc.website].filter(Boolean).join("  |  ");
  if (contactParts) {
    paras.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts, size: 18, color: "444444" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    );
  }

  // Summary
  if (doc.summary) {
    paras.push(
      ...makeSection("Perfil profesional", [
        new Paragraph({ children: [new TextRun({ text: doc.summary, size: 20 })], spacing: { after: 120 } }),
      ]),
    );
  }

  // Experience
  if (doc.experience?.length) {
    paras.push(
      ...makeSection(
        "Experiencia",
        doc.experience.flatMap((e: any) => [
          new Paragraph({
            children: [
              new TextRun({ text: e.position || "", bold: true, size: 22 }),
              new TextRun({ text: `  ${e.company || ""}`, size: 20, color: "555555" }),
            ],
            spacing: { before: 120, after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: [e.start_date, e.end_date || "Presente"].filter(Boolean).join(" – "), size: 18, color: "888888", italics: true })],
            spacing: { after: 60 },
          }),
          ...(e.description ? [new Paragraph({ children: [new TextRun({ text: e.description, size: 20 })], spacing: { after: 120 } })] : []),
        ]),
      ),
    );
  }

  // Education
  if (doc.education?.length) {
    paras.push(
      ...makeSection(
        "Educación",
        doc.education.flatMap((e: any) => [
          new Paragraph({
            children: [
              new TextRun({ text: e.degree || "", bold: true, size: 22 }),
              new TextRun({ text: `  ${e.institution || ""}`, size: 20, color: "555555" }),
            ],
            spacing: { before: 120, after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: [e.start_date, e.end_date || "Presente"].filter(Boolean).join(" – "), size: 18, color: "888888", italics: true })],
            spacing: { after: 120 },
          }),
        ]),
      ),
    );
  }

  // Skills
  if (doc.skills?.length) {
    const skillText = doc.skills.map((s: any) => (typeof s === "string" ? s : s.name || s)).join("  ·  ");
    paras.push(
      ...makeSection("Habilidades", [
        new Paragraph({ children: [new TextRun({ text: skillText, size: 20 })], spacing: { after: 120 } }),
      ]),
    );
  }

  const docx = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: marginTwip, bottom: marginTwip, left: marginTwip, right: marginTwip },
        },
      },
      children: paras,
    }],
  });

  const blob = await Packer.toBlob(docx);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^a-zA-Z0-9.-]/g, "_")}.docx`;
  a.click();
  URL.revokeObjectURL(a.href);
}
