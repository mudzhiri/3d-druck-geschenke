/** Minimal markdown → HTML for blog posts (headings, lists, links, bold, paragraphs). */
export function markdownToHtml(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  const inline = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="underline font-semibold">$1</a>',
      );

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeLists();
      continue;
    }
    if (line.startsWith("### ")) {
      closeLists();
      out.push(`<h3 class="mt-8 text-xl font-extrabold">${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeLists();
      out.push(`<h2 class="mt-10 text-2xl font-extrabold uppercase tracking-tight">${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      closeLists();
      out.push(`<h1 class="display text-4xl font-black md:text-5xl">${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (/^[-*] /.test(line)) {
      if (!inUl) {
        closeLists();
        out.push('<ul class="mt-4 list-disc space-y-2 pl-5">');
        inUl = true;
      }
      out.push(`<li>${inline(line.replace(/^[-*] /, ""))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      if (!inOl) {
        closeLists();
        out.push('<ol class="mt-4 list-decimal space-y-2 pl-5">');
        inOl = true;
      }
      out.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p class="mt-4 text-ink/80 leading-relaxed">${inline(line)}</p>`);
  }
  closeLists();
  return out.join("\n");
}
