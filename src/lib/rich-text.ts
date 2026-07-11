const ENTITY_MAP: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  "#39": "'",
};

function decodeEntities(text: string) {
  return text.replace(/&([a-zA-Z0-9#]+);/g, (_match, entity) => {
    return ENTITY_MAP[entity] ?? _match;
  });
}

export function htmlToPlainText(html: string) {
  if (!html) return "";

  const text = stripHtmlTagsUntilStable(
    html
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<\/blockquote>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/\u00a0/g, " "),
  );

  return stripHtmlTagsUntilStable(decodeEntities(text))
    .replace(/[<>]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export function isRichTextEmpty(html: string) {
  return htmlToPlainText(html).length === 0;
}

export function normalizeRichTextHtml(html: string) {
  return isRichTextEmpty(html) ? "" : html;
}

export function richTextPreview(html: string, maxLength = 80) {
  const plainText = htmlToPlainText(html).replace(/\s+/g, " ").trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

export function stripHtmlTagsUntilStable(input: string): string {
  let previous: string;
  let current = input;

  do {
    previous = current;
    current = current.replace(/<[^>]*>/g, "");
  } while (current !== previous);

  return current;
}
