/**
 * IndexNow Protocol Implementation for CVAI (cvai.com.mx)
 * 
 * IndexNow instantly informs search engines (Bing, Yandex, Naver, Seznam, etc.)
 * whenever website content is created, updated, or deleted.
 * 
 * Key: 3df992ba5d7d458f8bc3663211f2a46f
 * Key Location: https://www.cvai.com.mx/3df992ba5d7d458f8bc3663211f2a46f.txt
 */

export const INDEXNOW_KEY = "3df992ba5d7d458f8bc3663211f2a46f";
export const INDEXNOW_HOST = "www.cvai.com.mx";
export const INDEXNOW_ALT_HOST = "cvai.com.mx";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const BING_INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow";

export interface IndexNowSubmitResult {
  success: boolean;
  status: number;
  message: string;
  submittedCount: number;
  timestamp: string;
}

/**
 * Submit a batch of URLs to the IndexNow API
 */
export async function submitToIndexNow(
  urls: string[],
  host: string = INDEXNOW_HOST
): Promise<IndexNowSubmitResult> {
  if (!urls || urls.length === 0) {
    return {
      success: false,
      status: 400,
      message: "No se proporcionaron URLs para enviar a IndexNow.",
      submittedCount: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // Normalize URLs to full canonical format
  const normalizedUrls = Array.from(
    new Set(
      urls.map((u) => {
        const trimmed = u.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          return trimmed;
        }
        const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return `https://${host}${cleanPath}`;
      })
    )
  );

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList: normalizedUrls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const status = response.status;

    if (status === 200 || status === 202) {
      return {
        success: true,
        status,
        message:
          status === 200
            ? `${normalizedUrls.length} URL(s) indexada(s) exitosamente en IndexNow.`
            : `${normalizedUrls.length} URL(s) aceptada(s) por IndexNow (verificación pendiente).`,
        submittedCount: normalizedUrls.length,
        timestamp: new Date().toISOString(),
      };
    }

    let errorMessage = `HTTP ${status}: ${response.statusText}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage += ` - ${errorBody}`;
    } catch {
      // ignore text reading error
    }

    return {
      success: false,
      status,
      message: `Error al enviar a IndexNow: ${errorMessage}`,
      submittedCount: 0,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      status: 500,
      message: `Fallo de conexión con IndexNow: ${err?.message || "Error desconocido"}`,
      submittedCount: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Submit a single URL directly
 */
export async function submitSingleUrlToIndexNow(
  url: string,
  host: string = INDEXNOW_HOST
): Promise<IndexNowSubmitResult> {
  return submitToIndexNow([url], host);
}
