import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="page admin-page">
      <h1>Admin Dashboard</h1>
      <p>Admin panel will be displayed here</p>
      {user && <p className="text-muted">Signed in as {user.name}</p>}
    </div>
  );
}
