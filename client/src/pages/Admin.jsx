import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const tabs = ['Overview', 'New tutorial', 'New problem', 'Users'];

export default function Admin() {
  const [tab, setTab] = useState('Overview');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold">Admin</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              tab === t ? 'border-ink bg-ink text-white' : 'border-ink/15 bg-white hover:border-ink/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Overview' && <Overview />}
        {tab === 'New tutorial' && <TutorialForm />}
        {tab === 'New problem' && <ProblemForm />}
        {tab === 'Users' && <Users />}
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/admin/stats').then(setStats).catch(() => {}); }, []);
  if (!stats) return <p className="text-ink/60">Loading…</p>;

  const cards = [
    ['Learners', stats.users],
    ['Tutorials', stats.tutorials],
    ['Problems', stats.problems],
    ['Submissions', stats.submissions],
    ['Accepted', stats.accepted],
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="panel p-4">
            <p className="font-display text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-ink/60">{label}</p>
          </div>
        ))}
      </div>
      <div className="panel mt-4 p-4">
        <h2 className="font-display text-sm font-semibold">Problems by difficulty</h2>
        <ul className="mt-2 space-y-1 font-mono text-xs text-ink/70">
          {stats.byDifficulty.map((d) => <li key={d.difficulty}>{d.difficulty}: {d.n}</li>)}
        </ul>
      </div>
    </>
  );
}

function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { api('/categories').then(setCategories).catch(() => {}); }, []);
  return categories;
}

function TutorialForm() {
  const categories = useCategories();
  const [form, setForm] = useState({ title: '', summary: '', body: '', category_id: '', read_minutes: 5 });
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const saved = await api('/admin/tutorials', {
        method: 'POST',
        body: { ...form, category_id: form.category_id ? Number(form.category_id) : null, read_minutes: Number(form.read_minutes) },
      });
      setMessage(`Published at /tutorials/${saved.slug}`);
      setForm({ title: '', summary: '', body: '', category_id: '', read_minutes: 5 });
    } catch (err) { setMessage(err.message); }
  }

  return (
    <form onSubmit={submit} className="panel max-w-2xl space-y-3 p-4">
      <input className="field" placeholder="Title" value={form.title}
             onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input className="field" placeholder="One-line summary" value={form.summary}
             onChange={(e) => setForm({ ...form, summary: e.target.value })} />
      <div className="flex gap-3">
        <select className="field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="field" type="number" min="1" value={form.read_minutes}
               onChange={(e) => setForm({ ...form, read_minutes: e.target.value })} aria-label="Read minutes" />
      </div>
      <textarea className="field h-64 font-mono text-xs" placeholder="Body — markdown, including ``` code fences"
                value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
      {message && <p className="text-sm text-ink/70">{message}</p>}
      <button className="btn-primary">Publish tutorial</button>
    </form>
  );
}

function ProblemForm() {
  const categories = useCategories();
  const [form, setForm] = useState({
    title: '', difficulty: 'easy', statement: '', fn_name: '', starter_code: '', category_id: '',
  });
  const [tests, setTests] = useState([{ args: '[]', expected: '0', is_sample: true }]);
  const [message, setMessage] = useState('');

  function updateTest(i, patch) {
    setTests(tests.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  }

  async function submit(e) {
    e.preventDefault();
    setMessage('');
    let parsed;
    try {
      parsed = tests.map((t) => ({ args: JSON.parse(t.args), expected: JSON.parse(t.expected), is_sample: t.is_sample }));
    } catch {
      setMessage('Arguments and expected values must be valid JSON. Arguments are an array, e.g. [[1,2,3]].');
      return;
    }
    try {
      const saved = await api('/admin/problems', {
        method: 'POST',
        body: { ...form, category_id: form.category_id ? Number(form.category_id) : null, tests: parsed },
      });
      setMessage(`Created at /problems/${saved.slug}`);
    } catch (err) { setMessage(err.message); }
  }

  return (
    <form onSubmit={submit} className="panel max-w-2xl space-y-3 p-4">
      <input className="field" placeholder="Title" value={form.title}
             onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <div className="flex gap-3">
        <select className="field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
          <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>
        <select className="field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <input className="field font-mono" placeholder="Function the solution must define, e.g. sumArray"
             value={form.fn_name} onChange={(e) => setForm({ ...form, fn_name: e.target.value })} required />
      <textarea className="field h-40" placeholder="Statement — markdown" value={form.statement}
                onChange={(e) => setForm({ ...form, statement: e.target.value })} required />
      <textarea className="field h-28 font-mono text-xs" placeholder="Starter code" value={form.starter_code}
                onChange={(e) => setForm({ ...form, starter_code: e.target.value })} />

      <div>
        <h3 className="font-display text-sm font-semibold">Test cases</h3>
        <p className="mt-1 text-xs text-ink/60">
          Arguments are a JSON array of the values passed to the function. Sample tests are visible to learners.
        </p>
        <div className="mt-2 space-y-2">
          {tests.map((t, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input className="field flex-1 font-mono text-xs" value={t.args}
                     onChange={(e) => updateTest(i, { args: e.target.value })} aria-label={`Arguments ${i + 1}`} />
              <input className="field w-40 font-mono text-xs" value={t.expected}
                     onChange={(e) => updateTest(i, { expected: e.target.value })} aria-label={`Expected ${i + 1}`} />
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={t.is_sample} onChange={(e) => updateTest(i, { is_sample: e.target.checked })} />
                sample
              </label>
              <button type="button" className="text-xs text-hard"
                      onClick={() => setTests(tests.filter((_, idx) => idx !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button type="button" className="btn-quiet mt-2"
                onClick={() => setTests([...tests, { args: '[]', expected: 'null', is_sample: false }])}>
          Add test case
        </button>
      </div>

      {message && <p className="text-sm text-ink/70">{message}</p>}
      <button className="btn-signal">Create problem</button>
    </form>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const load = () => api('/admin/users').then(setUsers).catch(() => {});
  useEffect(() => { load(); }, []);

  async function setRole(id, role) {
    await api(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } });
    load();
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-ink/10 text-left text-ink/60">
          <tr><th className="px-4 py-2">User</th><th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th><th className="px-4 py-2">Submissions</th><th /></tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2 text-ink/60">{u.email}</td>
              <td className="px-4 py-2 font-mono text-xs">{u.role}</td>
              <td className="px-4 py-2 font-mono text-xs">{u.submissions}</td>
              <td className="px-4 py-2 text-right">
                <button className="text-xs underline" onClick={() => setRole(u.id, u.role === 'admin' ? 'user' : 'admin')}>
                  Make {u.role === 'admin' ? 'user' : 'admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
