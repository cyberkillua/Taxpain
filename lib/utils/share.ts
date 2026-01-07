/**
 * Shareable link utilities
 * Handles URL parameter encoding/decoding for shareable calculation links
 */

/**
 * Generate shareable URL with calculation parameters
 */
export function generateShareableUrl(
  basePath: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(basePath, typeof window !== "undefined" ? window.location.origin : "https://taxpain.com");
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.pathname + url.search;
}

/**
 * Parse URL parameters to object
 */
export function parseUrlParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Copy URL to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Generate mailto link with pre-filled content
 */
export function generateMailtoLink(
  subject: string,
  body: string
): string {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:?${params.toString()}`;
}

