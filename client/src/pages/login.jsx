import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import { isEmailValid, isRequired } from "../utils/validators";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!isRequired(form.email) || !isRequired(form.password)) {
      return "Todos los campos son obligatorios";
    }

    if (!isEmailValid(form.email)) {
      return "Email inválido";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(form.email, form.password);

      navigate("/"); // redirect después de login

    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
        <h2 className="gradient-text text-center">Login</h2>

        <form onSubmit={handleSubmit} className="mt-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

          <button className="btn-primary w-100 mt-2">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;