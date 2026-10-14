import { useEffect, useState } from "react";
import { supabase } from "@/lib/db/client";

export type CompanyLegalConfig = {
  companyName: string;
  brandName: string;
  tagline: string;
  supportEmail: string;
  legalEmail: string;
  businessEmail: string;
  address: string;
  city: string;
  country: string;
  websiteUrl: string;
  privacyUpdated: string;
  termsUpdated: string;
  refundUpdated: string;
  cookieUpdated: string;
  disclaimerUpdated: string;
  aiTransparencyUpdated: string;
  billingUpdated: string;
  legalEntityInfo: string;
  paymentProvider: string;
  aiProvider: string;
  storageProvider: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
  };
};

export const DEFAULT_LEGAL_CONFIG: CompanyLegalConfig = {
  companyName: "Curriculum Vitae AI",
  brandName: "CVAI",
  tagline: "El constructor de currículum inteligente para México",
  supportEmail: "support@cvai.com.mx",
  legalEmail: "legal@cvai.com.mx",
  businessEmail: "contacto@cvai.com.mx",
  address: "Ciudad de México",
  city: "Ciudad de México",
  country: "México",
  websiteUrl: "https://www.cvai.com.mx",
  privacyUpdated: "14 de Septiembre de 2026",
  termsUpdated: "14 de Septiembre de 2026",
  refundUpdated: "14 de Septiembre de 2026",
  cookieUpdated: "14 de Septiembre de 2026",
  disclaimerUpdated: "14 de Septiembre de 2026",
  aiTransparencyUpdated: "14 de Septiembre de 2026",
  billingUpdated: "14 de Septiembre de 2026",
  legalEntityInfo: "Plataforma digital desarrollada y operada por fkdigitalmedia, enfocada en soluciones de inteligencia artificial y optimización laboral en México.",
  paymentProvider: "Lemon Squeezy",
  aiProvider: "DeepSeek AI",
  storageProvider: "Cloudflare R2",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/firoz-khan-1153358a/",
    twitter: "https://twitter.com/cvai_mx",
    facebook: "",
    instagram: "",
    github: "https://github.com/fkdigitalmedia",
  },
};

let cachedConfig: CompanyLegalConfig | null = null;

export function useCompanyLegalConfig() {
  const [config, setConfig] = useState<CompanyLegalConfig>(cachedConfig || DEFAULT_LEGAL_CONFIG);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("system_settings" as any)
          .select("key, value")
          .in("key", ["legal_company", "general"]);

        if (error || !data) return;

        const legalRow = data.find((r: any) => r.key === "legal_company")?.value;
        const genRow = data.find((r: any) => r.key === "general")?.value;

        const merged: CompanyLegalConfig = {
          ...DEFAULT_LEGAL_CONFIG,
          ...(legalRow || {}),
          ...(genRow?.supportEmail ? { supportEmail: genRow.supportEmail } : {}),
          ...(genRow?.siteName ? { companyName: genRow.siteName } : {}),
        };

        cachedConfig = merged;
        setConfig(merged);
      } catch (e) {
        console.warn("Could not load dynamic legal config, using defaults:", e);
      }
    }

    load();
  }, []);

  return config;
}
