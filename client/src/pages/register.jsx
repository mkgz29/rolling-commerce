import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";
import loginRegisterBg from "../assets/loginregister.jpg";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Ingresá tu nombre.";
    if (!formData.lastName) newErrors.lastName = "Ingresá tu apellido.";
    if (!formData.email) newErrors.email = "Ingresá tu email.";
    else if (!formData.email.includes("@")) newErrors.email = "El email debe contener @.";
    if (!formData.password) newErrors.password = "Ingresá una contraseña.";
    else if (formData.password.length < 6) newErrors.password = "Mínimo 6 caracteres.";
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Las contraseñas no coinciden.";
    }
    if (!formData.terms) newErrors.terms = "Debés aceptar los términos.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await register({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Ya podés iniciar sesión.",
        background: "#0f0f1a",
        color: "#fff",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate("/login"));
    } catch (submitError) {
      setErrors({
        submit:
          submitError?.message ||
          "No pudimos crear la cuenta. Revisá tus datos e intentá nuevamente.",
      });
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "12px 16px",
    background: "rgba(13,110,253,0.06)",
    border: `1px solid ${hasError ? "#d946ef" : "rgba(13,110,253,0.34)"}`,
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  });

  const handleFocus = (event) => {
    event.target.style.borderColor = "#0d6efd";
    event.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,0.16)";
  };

  const handleBlur = (event, hasError) => {
    event.target.style.borderColor = hasError ? "#d946ef" : "rgba(13,110,253,0.34)";
    event.target.style.boxShadow = "none";
  };

  return (
    <div className="auth-page" style={styles.page}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <div style={styles.logoCircle}>TC</div>
          <h1 style={styles.title}>Crear cuenta</h1>
          <p style={styles.subtitle}>Sumate a Tech Core</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.nameGrid}>
            <div>
              <label style={styles.label}>Nombre</label>
              <input
                type="text"
                name="firstName"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle(errors.firstName)}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, errors.firstName)}
              />
              {errors.firstName && <p style={styles.error}>{errors.firstName}</p>}
            </div>
            <div>
              <label style={styles.label}>Apellido</label>
              <input
                type="text"
                name="lastName"
                placeholder="Pérez"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle(errors.lastName)}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, errors.lastName)}
              />
              {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle(errors.email)}
              onFocus={handleFocus}
              onBlur={(event) => handleBlur(event, errors.email)}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                style={{ ...inputStyle(errors.password), paddingRight: "48px" }}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, errors.password)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? "ocultar" : "mostrar"}
              </button>
            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirmar contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showRepeat ? "text" : "password"}
                name="repeatPassword"
                placeholder="Repetí tu contraseña"
                value={formData.repeatPassword}
                onChange={handleChange}
                style={{ ...inputStyle(errors.repeatPassword), paddingRight: "48px" }}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, errors.repeatPassword)}
              />
              <button type="button" onClick={() => setShowRepeat(!showRepeat)} style={styles.eyeBtn}>
                {showRepeat ? "ocultar" : "mostrar"}
              </button>
            </div>
            {errors.repeatPassword && <p style={styles.error}>{errors.repeatPassword}</p>}
          </div>

          <div style={styles.termsBlock}>
            <label style={styles.termsLabel}>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>
                Acepto los <a href="#terms" style={styles.link}>términos y condiciones</a>
              </span>
            </label>
            {errors.terms && <p style={styles.error}>{errors.terms}</p>}
          </div>

          {(errors.submit || error) && (
            <p style={{ ...styles.error, marginBottom: "20px" }}>
              {errors.submit || error}
            </p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </motion.button>

          <p style={styles.linkText}>
            ¿Ya tenés cuenta? <Link to="/login" style={styles.link}>Ingresar</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 92px)",
    width: "100%",
    backgroundImage: `linear-gradient(135deg, rgba(4, 8, 18, 0.54), rgba(4, 8, 18, 0.68)), url(${loginRegisterBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(24px, 5vh, 48px) 20px",
    position: "relative",
    overflowX: "hidden",
    overflowY: "visible",
    boxSizing: "border-box",
  },
  bgGlow1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(13,110,253,0.14) 0%, transparent 70%)",
    top: "-150px",
    right: "-150px",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
    bottom: "-150px",
    left: "-150px",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(10, 14, 24, 0.86)",
    backdropFilter: "blur(20px)",
    borderRadius: "18px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "none",
    border: "1px solid rgba(131,216,255,0.18)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(13,110,253,0.08)",
    position: "relative",
    zIndex: 1,
  },
  logoCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "14px",
    background: "#0d6efd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff",
    boxShadow: "0 0 30px rgba(13,110,253,0.34)",
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#aeb8c7",
    fontSize: "14px",
    margin: 0,
  },
  nameGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "#d1d5db",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#aeb8c7",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 8px",
  },
  termsBlock: {
    marginBottom: "24px",
  },
  termsLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d1d5db",
    cursor: "pointer",
    fontSize: "14px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#0d6efd",
    cursor: "pointer",
  },
  error: {
    color: "#ff7a9d",
    fontSize: "13px",
    margin: "6px 0 0",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "#0d6efd",
    border: "1px solid #0d6efd",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(13,110,253,0.28)",
    marginBottom: "20px",
    letterSpacing: "0",
  },
  linkText: {
    textAlign: "center",
    color: "#aeb8c7",
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: "#8ec5ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};
