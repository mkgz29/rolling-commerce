import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    setSuccess('Account created. You can log in now.');
    setTimeout(() => navigate('/login'), 700);
  };

  return (
    <div className="page register-page">
      <h1>Register</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            className="form-control"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
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
            minLength={6}
            required
          />
        </div>
        {error && <p className="text-danger mb-0">{error}</p>}
        {success && <p className="text-success mb-0">{success}</p>}
        <div className="col-12 d-flex align-items-center gap-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
          <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
