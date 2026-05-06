import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate(from, { replace: true });
  };

  return (
    <div className="page login-page">
      <h1>Login</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            className="form-control"
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            className="form-control"
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="text-danger mb-0">{error}</p>}
        <div className="col-12 d-flex align-items-center gap-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
