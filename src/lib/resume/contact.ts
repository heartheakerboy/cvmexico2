import type { ResumeDoc } from "./types";

export function contactList(doc: ResumeDoc): string[] {
  return [doc.email, doc.phone, doc.location, doc.website].filter(Boolean);
}