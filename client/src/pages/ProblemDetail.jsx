import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import Markdown from '../components/Markdown.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import Difficulty from '../components/Difficulty.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProblemDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [outcome, setOutcome] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/problems/${slug}`)
      .then((p) => { setProblem(p); setCode(p.starter_code); })
      .catch((e) => setError(e.message));
  }, [slug]);

  async function send(action) {
    setBusy(action);
    setError('');
    try {
      setOutcome(await api(`/problems/${slug}/${action}`, { method: 'POST', body: { code } }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }

  if (error && !problem) return <p className="mx-auto max-w-6xl px-4 py-16">{error}</p>;
  if (!problem) return <p className="mx-auto max-w-6xl px-4 py-16 text-ink/60">Loading…</p>;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
      <section>
        <div className="flex items-center gap-3">
          <Difficulty level={problem.difficulty} />
          <Link to={`/problems?category=${problem.category_slug}`} className="font-mono text-xs text-ink/55 hover:text-ink">
            {problem.category}
          </Link>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold">{problem.title}</h1>
        <Markdown text={problem.statement} className="mt-4" />

        <h2 className="mt-8 font-display text-sm font-semibold">Sample tests</h2>
        <ul className="mt-2 space-y-2">
          {problem.samples.map((s) => (
            <li key={s.id} className="rounded-md border border-ink/10 bg-white p-3 font-mono text-xs">
              <div className="text-ink/60">{problem.fn_name}({s.args.map((a) => JSON.stringify(a)).join(', ')})</div>
              <div className="mt-1">expected {JSON.stringify(s.expected)}</div>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-xs text-ink/45">
          {problem.test_count} tests run on submit, including hidden ones.
        </p>
      </section>

      <section>
        <CodeEditor value={code} onChange={setCode} label={`${problem.fn_name}.js`} />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {user ? (
            <>
              <button onClick={() => send('run')} disabled={!!busy} className="btn-quiet">
                {busy === 'run' ? 'Running…' : 'Run sample tests'}
              </button>
              <button onClick={() => send('submit')} disabled={!!busy} className="btn-signal">
                {busy === 'submit' ? 'Submitting…' : 'Submit solution'}
              </button>
              <button onClick={() => { setCode(problem.starter_code); setOutcome(null); }} className="text-sm text-ink/60 hover:text-ink">
                Reset code
              </button>
            </>
          ) : (
            <p className="text-sm text-ink/65">
              <Link to="/login" className="underline">Sign in</Link> to run and submit your solution.
            </p>
          )}
        </div>

        {error && <p className="mt-3 rounded-md border border-hard/30 bg-hard/5 p-3 text-sm text-hard">{error}</p>}

        {outcome && (
          <div className="mt-4 panel p-4">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold">
                {outcome.status === 'passed' && 'All tests passed'}
                {outcome.status === 'failed' && 'Some tests failed'}
                {outcome.status === 'error' && 'The code did not run'}
              </p>
              <span className="font-mono text-xs text-ink/45">{outcome.runtimeMs} ms</span>
            </div>

            {outcome.message && <p className="mt-2 text-sm text-hard">{outcome.message}</p>}

            <ul className="mt-3 space-y-1 font-mono text-xs">
              {outcome.results.map((r, i) => (
                <li key={r.id} className="flex items-center gap-2">
                  <span className={r.passed ? 'text-easy' : 'text-hard'}>{r.passed ? 'pass' : 'fail'}</span>
                  <span className="text-ink/60">test {i + 1}{r.is_sample ? '' : ' (hidden)'}</span>
                  {!r.passed && r.actual !== undefined && <span className="text-ink/60">got {r.actual}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
