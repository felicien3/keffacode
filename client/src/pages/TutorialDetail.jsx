import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import Markdown from '../components/Markdown.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function TutorialDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    api(`/tutorials/${slug}`).then(setTutorial).catch((e) => setError(e.message));
  }, [slug]);

  async function markRead() {
    await api(`/tutorials/${slug}/complete`, { method: 'POST' });
    setDone(true);
  }

  if (error) return <p className="mx-auto max-w-3xl px-4 py-16">{error}</p>;
  if (!tutorial) return <p className="mx-auto max-w-3xl px-4 py-16 text-ink/60">Loading…</p>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to={`/tutorials?category=${tutorial.category_slug}`} className="font-mono text-xs text-ink/55 hover:text-ink">
        {tutorial.category}
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">{tutorial.title}</h1>
      <p className="mt-2 text-ink/70">{tutorial.summary}</p>
      <p className="mt-2 font-mono text-xs text-ink/45">
        {tutorial.read_minutes} min read · by {tutorial.author || 'KeffaCode'}
      </p>

      <Markdown text={tutorial.body} className="mt-8" />

      <div className="mt-10 border-t border-ink/10 pt-6">
        {user ? (
          <button onClick={markRead} disabled={done} className={done ? 'btn-quiet' : 'btn-primary'}>
            {done ? 'Marked as read' : 'Mark as read'}
          </button>
        ) : (
          <p className="text-sm text-ink/65">
            <Link to="/login" className="underline">Sign in</Link> to track what you have read.
          </p>
        )}
      </div>
    </article>
  );
}
