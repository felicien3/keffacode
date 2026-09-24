import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Difficulty from '../components/Difficulty.jsx';

function Bar({ value, total, label }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs text-ink/55">{value} / {total}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-ink/10">
        <div className="h-2 rounded-full bg-signal" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => { api('/profile').then(setData).catch(() => {}); }, []);

  if (!data) return <p className="mx-auto max-w-5xl px-4 py-16 text-ink/60">Loading…</p>;
  const { stats, solved, tutorialsRead, recentSubmissions } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold">{user.username}</h1>
      <p className="mt-1 font-mono text-xs text-ink/50">{user.email}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="panel space-y-4 p-4">
          <Bar value={stats.solvedCount} total={stats.problemTotal} label="Problems solved" />
          <Bar value={stats.tutorialsReadCount} total={stats.tutorialTotal} label="Tutorials read" />
          <p className="font-mono text-xs text-ink/50">{stats.submissions} submissions in total</p>
        </div>

        <div className="panel p-4">
          <h2 className="font-display text-sm font-semibold">Recent submissions</h2>
          {recentSubmissions.length === 0 ? (
            <p className="mt-2 text-sm text-ink/65">
              Nothing yet. <Link to="/problems" className="underline">Pick a problem</Link> and submit your first solution.
            </p>
          ) : (
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {recentSubmissions.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={s.status === 'passed' ? 'text-easy' : 'text-hard'}>{s.status}</span>
                  <Link to={`/problems/${s.slug}`} className="truncate hover:underline">{s.title}</Link>
                  <span className="ml-auto text-ink/45">{s.passed_count}/{s.total_count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="panel p-4">
          <h2 className="font-display text-sm font-semibold">Solved</h2>
          <ul className="mt-2 space-y-2">
            {solved.map((p) => (
              <li key={p.slug} className="flex items-center gap-2 text-sm">
                <Link to={`/problems/${p.slug}`} className="hover:underline">{p.title}</Link>
                <Difficulty level={p.difficulty} />
              </li>
            ))}
            {solved.length === 0 && <li className="text-sm text-ink/65">No solved problems yet.</li>}
          </ul>
        </section>

        <section className="panel p-4">
          <h2 className="font-display text-sm font-semibold">Read</h2>
          <ul className="mt-2 space-y-2">
            {tutorialsRead.map((t) => (
              <li key={t.slug} className="text-sm">
                <Link to={`/tutorials/${t.slug}`} className="hover:underline">{t.title}</Link>
              </li>
            ))}
            {tutorialsRead.length === 0 && <li className="text-sm text-ink/65">No tutorials marked as read yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
