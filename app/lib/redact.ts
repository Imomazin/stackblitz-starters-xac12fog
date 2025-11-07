// very simple client side redaction - removes emails, phones, card-ish strings
export function redactPII(src: string) {
  return src
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g, "[phone]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[card]");
}
export function clampInput(text: string, max = 600) {
  if (text.length <= max) return text;
  return text.slice(0, max) + " …";
}
