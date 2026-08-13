function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const CODE_MARK_OPEN = 'XMDCODEX';
const CODE_MARK_CLOSE = 'XENDCODEX';

// NOTE: href/src values are inserted after the surrounding text is escaped,
// so a crafted javascript: link URL is still possible in principle. Posts
// are authored solely by the site owner, so this residual risk is accepted
// rather than guarded against.
function parseInline(text) {
  const codeSpans = [];
  let escaped = escapeHtml(text);

  escaped = escaped.replace(/`([^`]+?)`/g, function (match, code) {
    codeSpans.push(code);
    return CODE_MARK_OPEN + (codeSpans.length - 1) + CODE_MARK_CLOSE;
  });

  escaped = escaped.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    function (match, alt, url, title) {
      const titleAttr = title ? ' title="' + title + '"' : '';
      return '<img src="' + url + '" alt="' + alt + '"' + titleAttr + '>';
    }
  );

  escaped = escaped.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    function (match, label, url, title) {
      const titleAttr = title ? ' title="' + title + '"' : '';
      return '<a href="' + url + '"' + titleAttr + ' rel="noopener">' + label + '</a>';
    }
  );

  escaped = escaped.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/__([^_]+?)__/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
  escaped = escaped.replace(/_([^_]+?)_/g, '<em>$1</em>');

  const restorePattern = new RegExp(CODE_MARK_OPEN + '(\\d+)' + CODE_MARK_CLOSE, 'g');
  escaped = escaped.replace(restorePattern, function (match, index) {
    return '<code>' + codeSpans[Number(index)] + '</code>';
  });

  return escaped;
}

export function parseMarkdown(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1];
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      const langClass = lang ? ' class="language-' + lang + '"' : '';
      html.push('<pre><code' + langClass + '>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      html.push('<hr>');
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      html.push('<h' + level + '>' + parseInline(heading[2].trim()) + '</h' + level + '>');
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      html.push('<blockquote><p>' + parseInline(quoteLines.join(' ').trim()) + '</p></blockquote>');
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ''));
        i++;
      }
      const itemsHtml = items.map(function (item) { return '<li>' + parseInline(item) + '</li>'; }).join('');
      html.push('<ul>' + itemsHtml + '</ul>');
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      const itemsHtml = items.map(function (item) { return '<li>' + parseInline(item) + '</li>'; }).join('');
      html.push('<ol>' + itemsHtml + '</ol>');
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^```/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^[-*+]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    html.push('<p>' + parseInline(paraLines.join(' ').trim()) + '</p>');
  }

  return html.join('\n');
}
