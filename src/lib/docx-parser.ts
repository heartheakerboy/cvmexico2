/**
 * Client-side Word (.docx) text extraction utility using pako.
 * Fast, lightweight and 100% in-browser without sending files to any server.
 */

export interface DocxExtractionResult {
  text: string;
  wordCount: number;
  characterCount: number;
}

export async function extractTextFromDocx(file: File): Promise<DocxExtractionResult> {
  const pako = await import("pako");

  const arrayBuffer = await file.arrayBuffer();
  const u8 = new Uint8Array(arrayBuffer);
  const view = new DataView(u8.buffer);

  let offset = 0;
  let extractedXml = "";

  while (offset < u8.length - 30) {
    const sig = view.getUint32(offset, true);
    // Local file header signature 0x04034b50 (PK\x03\x04)
    if (sig !== 0x04034b50) {
      offset++;
      continue;
    }

    const method = view.getUint16(offset + 8, true);
    const compSize = view.getUint32(offset + 18, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const nameBytes = u8.subarray(offset + 30, offset + 30 + nameLen);
    const name = new TextDecoder().decode(nameBytes);

    const dataStart = offset + 30 + nameLen + extraLen;
    const dataEnd = dataStart + compSize;

    if (name === "word/document.xml") {
      const compData = u8.subarray(dataStart, dataEnd);
      if (method === 8) {
        const decomp = pako.inflateRaw(compData);
        extractedXml = new TextDecoder().decode(decomp);
      } else {
        extractedXml = new TextDecoder().decode(compData);
      }
      break;
    }

    offset = dataEnd;
  }

  if (!extractedXml) {
    throw new Error(
      "No se pudo encontrar el contenido de texto principal dentro del archivo Word (.docx)."
    );
  }

  // Extract paragraphs <w:p> and runs <w:t>
  const paragraphs = extractedXml.match(/<w:p[\s>].*?<\/w:p>/g) || [];
  const lines: string[] = [];

  for (const p of paragraphs) {
    const texts = p.match(/<w:t[\s>].*?<\/w:t>/g) || [];
    const line = texts.map((t) => t.replace(/<[^>]+>/g, "")).join("");
    if (line.trim()) {
      lines.push(line.trim());
    }
  }

  const fullText = lines.join("\n\n");

  if (!fullText.trim()) {
    throw new Error(
      "El archivo Word (.docx) parece estar vacío o contener únicamente imágenes."
    );
  }

  const words = fullText.trim().split(/\s+/).filter(Boolean).length;

  return {
    text: fullText,
    wordCount: words,
    characterCount: fullText.length,
  };
}
