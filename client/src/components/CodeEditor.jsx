import { useRef } from 'react';

// A deliberately small editor: a monospace textarea that handles Tab and keeps
// the caret where the writer expects it. Swap in CodeMirror later without
// changing the props.
export default function CodeEditor({ value, onChange, label = 'Solution' }) {
  const ref = useRef(null);

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = ref.current;
    const { selectionStart: start, selectionEnd: end } = el;
    const next = `${value.slice(0, start)}  ${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2; });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink/15 bg-ink">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="font-mono text-xs text-paper/70">{label}</span>
        <span className="font-mono text-xs text-paper/40">JavaScript</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="h-80 w-full resize-y bg-ink p-4 font-mono text-sm leading-6 text-paper outline-none"
        aria-label={label}
      />
    </div>
  );
}
