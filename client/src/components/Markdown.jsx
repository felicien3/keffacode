import { renderMarkdown } from '../lib/markdown.js';

export default function Markdown({ text, className = '' }) {
  return (
    <div
      className={`prose-note ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}
