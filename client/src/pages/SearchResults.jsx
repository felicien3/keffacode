import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import Difficulty from '../components/Difficulty.jsx';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || 'all';
  const [results, setResults] = useState({ tutorials: [], problems: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api(`/search?q=${encodeURIComponent(q)}&type=${type}`)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q, type]);

  const total = results.tutorials.length + results.problems.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold">Results for “{q}”</h1>

      <div className="mt-4 flex gap-2">
        {['all', 'tutorials', 'problems'].map((t) => (
          <button
            key={t}
            onClick={() => setParams({ q, type: t })}
            className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
              type === t ? 'border-ink bg-ink text-white' : 'border-ink/15 bg-white hover:border-ink/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-ink/60">Searching…</p>}
      {!loading && total === 0 && (
        <p className="mt-8 text-ink/65">Nothing matched. Try a shorter word, or browse the categories.</p>
      )}

      {results.tutorials.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-sm font-semibold">Tutorials</h2>
          <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
            {results.tutorials.map((t) => (
              <li key={t.slug} className="py-3">
                <Link to={`/tutorials/${t.slug}`} className="font-medium hover:underline">{t.title}</Link>
                <p className="text-sm text-ink/65">{t.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.problems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-sm font-semibold">Problems</h2>
          <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
            {results.problems.map((p) => (
              <li key={p.slug} className="flex items-center gap-3 py-3">
                <Link to={`/problems/${p.slug}`} className="font-medium hover:underline">{p.title}</Link>
                <Difficulty level={p.difficulty} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
