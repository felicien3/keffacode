import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ breaks: false, gfm: true });

export function renderMarkdown(text = '') {
  return DOMPurify.sanitize(marked.parse(text));
}
