import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../services/api";
import Loader from "../components/Loader";
import {
  isEmailValid,
  isPasswordValid,
  isRequired,
} from "../utils/validators";

function Register() {
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

    if (!isPasswordValid(form.password)) {
      return "La contraseña debe tener al menos 6 caracteres";
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

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("Usuario creado correctamente");

      navigate("/login");

    } catch (err) {
      setError("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
        <h2 className="gradient-text text-center">Registro</h2>

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
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;