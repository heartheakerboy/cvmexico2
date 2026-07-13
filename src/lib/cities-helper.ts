import type { ResumeDoc } from "@/lib/resume/types";
import type { City } from "@/lib/cities-data";

export function localizeResumeDoc(doc: ResumeDoc, city: City): ResumeDoc {
  // Deep clone to avoid mutating the original object
  const next = JSON.parse(JSON.stringify(doc)) as ResumeDoc;
  
  // 1. Localize location
  next.location = `${city.name}, ${city.stateCode || "México"}`;
  
  // 2. Localize phone number (replace area code)
  // Mexico phone numbers are +52 XX XXXX XXXX or similar
  const phone = next.phone || "+52 55 4321 0987";
  const areaCode = city.phoneAreaCode || "55";
  next.phone = phone.replace(/(\+52\s)?\d{2,3}/, (match, prefix) => {
    return prefix ? `${prefix}${areaCode}` : areaCode;
  });

  // 3. Localize companies in experience (match indices to avoid index errors)
  if (next.experience && next.experience.length > 0) {
    next.experience.forEach((exp, idx) => {
      if (city.companies && city.companies.length > idx) {
        exp.company = city.companies[idx];
      }
      exp.location = `${city.name}, ${city.stateCode}`;
    });
  }

  // 4. Localize universities in education
  if (next.education && next.education.length > 0) {
    next.education.forEach((edu, idx) => {
      if (city.universities && city.universities.length > idx) {
        edu.school = city.universities[idx];
      }
      edu.location = `${city.name}, ${city.stateCode}`;
    });
  }

  return next;
}
