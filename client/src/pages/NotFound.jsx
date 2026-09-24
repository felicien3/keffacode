import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-ink/50">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">That page does not exist</h1>
      <p className="mt-2 text-ink/65">The link may be old, or the content was removed.</p>
      <Link to="/" className="btn-primary mt-6">Back to the home page</Link>
    </div>
  );
}
