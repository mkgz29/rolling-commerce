import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";

function Profile() {
  const { user } = useAuth();

  if (!user) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <h2>Perfil</h2>

      <div className="card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user._id}</p>
      </div>
    </div>
  );
}

export default Profile;