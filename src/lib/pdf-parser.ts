/**
 * Client-side PDF text extraction utility using pdfjs-dist.
 * Runs completely in the browser for speed, privacy, and zero server overhead.
 */

export interface PdfExtractionResult {
  text: string;
  numPages: number;
  wordCount: number;
  characterCount: number;
}

export async function extractTextFromPdf(file: File): Promise<PdfExtractionResult> {
  if (typeof window === "undefined") {
    throw new Error("La extracción de PDF solo está disponible en el navegador.");
  }

  // Dynamically import pdfjs-dist on client
  const pdfjs = await import("pdfjs-dist");

  // Configure worker
  try {
    const workerModule = await import("pdfjs-dist/build/pdf.worker.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
  } catch {
    // Fallback to unpkg CDN if worker import fails
    const version = pdfjs.version || "4.10.38";
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const doc = await loadingTask.promise;
  const numPages = doc.numPages;

  if (numPages === 0) {
    throw new Error("El archivo PDF no contiene páginas legibles.");
  }

  const pageTexts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    let pageStr = "";

    for (const item of content.items as any[]) {
      if (!("str" in item)) continue;
      const str = item.str;
      if (!str) continue;

      // Detect line break when vertical position changes significantly
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 4) {
        pageStr += "\n";
      } else if (pageStr.length > 0 && !pageStr.endsWith(" ") && !pageStr.endsWith("\n")) {
        pageStr += " ";
      }

      pageStr += str;
      lastY = item.transform[5];
    }

    if (pageStr.trim()) {
      pageTexts.push(pageStr.trim());
    }
  }

  const fullText = pageTexts.join("\n\n");

  if (!fullText.trim()) {
    throw new Error(
      "No se pudo extraer texto legible del PDF. Es posible que sea una imagen escaneada o un archivo protegido."
    );
  }

  const words = fullText.trim().split(/\s+/).filter(Boolean).length;

  return {
    text: fullText,
    numPages,
    wordCount: words,
    characterCount: fullText.length,
  };
}
