import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import * as fs from "fs";
import * as path from "path";
import esDict from "@/lib/i18n/locales/es";

function getFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

export const getTranslationHealthReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    try {
      const srcDir = path.resolve(process.cwd(), "src");
      const files = getFiles(srcDir);
      
      // Exclude locale files to avoid self-references
      const filesToScan = files.filter(f => !f.replace(/\\/g, "/").includes("lib/i18n/locales/"));

      const keys = Object.keys(esDict);
      const usageMap: Record<string, number> = {};
      keys.forEach(k => { usageMap[k] = 0; });

      // Read each file and count key occurrences
      filesToScan.forEach((file) => {
        const content = fs.readFileSync(file, "utf8");
        keys.forEach((key) => {
          if (content.includes(key)) {
            usageMap[key]++;
          }
        });
      });

      const unusedKeys = keys.filter(k => usageMap[k] === 0);

      // Find duplicate values in base (esDict)
      const valueMap: Record<string, string[]> = {};
      Object.entries(esDict).forEach(([k, v]) => {
        if (!valueMap[v]) {
          valueMap[v] = [];
        }
        valueMap[v].push(k);
      });

      const duplicateKeys: { value: string; keys: string[] }[] = [];
      Object.entries(valueMap).forEach(([val, kList]) => {
        if (kList.length > 1) {
          duplicateKeys.push({ value: val, keys: kList });
        }
      });

      return {
        success: true,
        unusedKeys,
        duplicateKeys,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  });
