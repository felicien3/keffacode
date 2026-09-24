import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import CategoryRail from '../components/CategoryRail.jsx';

export default function Tutorials() {
  const [params] = useSearchParams();
  const category = params.get('category');
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api('/categories').then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    api(`/tutorials${category ? `?category=${category}` : ''}`)
      .then(setTutorials)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <CategoryRail categories={categories} basePath="/tutorials" active={category} countKey="tutorial_count" />

      <section>
        <h1 className="font-display text-2xl font-semibold">Tutorials</h1>
        <p className="mt-1 text-ink/65">Short reads, each one thing at a time.</p>

        {loading ? (
          <p className="mt-8 text-ink/60">Loading…</p>
        ) : tutorials.length === 0 ? (
          <p className="mt-8 text-ink/60">No tutorials here yet. Pick another category.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {tutorials.map((t) => (
              <li key={t.slug} className="panel p-4">
                <Link to={`/tutorials/${t.slug}`} className="font-display text-lg font-semibold hover:underline">
                  {t.title}
                </Link>
                <p className="mt-1 text-sm text-ink/70">{t.summary}</p>
                <p className="mt-2 font-mono text-xs text-ink/45">{t.category} · {t.read_minutes} min read</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
