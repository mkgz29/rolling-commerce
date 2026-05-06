import useAuth from "../hooks/useAuth";

function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <p>No autorizado</p>;
  }

  return (
    <div className="container mt-5 pt-5">
      <h2>Admin Dashboard</h2>
      <p>Gestión de productos y órdenes</p>
    </div>
  );
}

export default AdminDashboard;