export function captializeFirstLetter(string: string) {
  if (!string?.length) {
    return;
  }

  return string[0].toUpperCase() + string.slice(1);
}

export function isStringUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (e) {
    return false;
  }
}

export function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Replace line break tags with spaces before removing other tags
  let text = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?(p|div|h[1-6])\b[^>]*>/gi, " ");

  // Remove remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Replace common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

  // Clean up extra whitespace and line breaks
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
