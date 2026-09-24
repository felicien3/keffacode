import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="mx-auto max-w-6xl px-4 py-16 text-ink/60">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) {
    return <p className="mx-auto max-w-6xl px-4 py-16">This page is for admins.</p>;
  }
  return children;
}
