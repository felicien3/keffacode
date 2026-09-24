import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import CategoryRail from '../components/CategoryRail.jsx';
import Difficulty from '../components/Difficulty.jsx';

const levels = ['easy', 'medium', 'hard'];

export default function Problems() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category');
  const difficulty = params.get('difficulty');
  const [categories, setCategories] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => { api('/categories').then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (difficulty) qs.set('difficulty', difficulty);
    api(`/problems?${qs}`).then(setProblems).catch(() => {});
  }, [category, difficulty]);

  function toggleDifficulty(level) {
    const next = new URLSearchParams(params);
    if (difficulty === level) next.delete('difficulty');
    else next.set('difficulty', level);
    setParams(next);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <CategoryRail categories={categories} basePath="/problems" active={category} countKey="problem_count" />

      <section>
        <h1 className="font-display text-2xl font-semibold">Practice</h1>
        <p className="mt-1 text-ink/65">Write a function, run it against the tests, submit when it passes.</p>

        <div className="mt-4 flex gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => toggleDifficulty(level)}
              className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
                difficulty === level ? 'border-ink bg-ink text-white' : 'border-ink/15 bg-white hover:border-ink/40'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <ul className="mt-6 divide-y divide-ink/10 overflow-hidden rounded-lg border border-ink/10 bg-white">
          {problems.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Link to={`/problems/${p.slug}`} className="font-medium hover:underline">{p.title}</Link>
              <Difficulty level={p.difficulty} />
              <span className="ml-auto font-mono text-xs text-ink/45">{p.category} · {p.test_count} tests</span>
            </li>
          ))}
          {problems.length === 0 && (
            <li className="px-4 py-8 text-center text-ink/60">Nothing matches those filters yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
