import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";
import loginRegisterBg from "../assets/loginregister.jpg";

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Ingresá tu email.";
    else if (!email.includes("@")) newErrors.email = "El email debe contener @.";
    if (!password) newErrors.password = "Ingresá tu contraseña.";
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres.";
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
      await login({ email: email.trim(), password });

      Swal.fire({
        icon: "success",
        title: "Bienvenido de nuevo",
        text: `Sesión iniciada como ${email}`,
        background: "#0f0f1a",
        color: "#fff",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate(from, { replace: true }));
    } catch (submitError) {
      setErrors({
        submit:
          submitError?.message ||
          "No pudimos iniciar sesión. Revisá tus datos e intentá nuevamente.",
      });
    }
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
          <h1 style={styles.title}>Bienvenido</h1>
          <p style={styles.subtitle}>Ingresá a tu cuenta</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{
                ...styles.input,
                borderColor: errors.email ? "#d946ef" : "rgba(13,110,253,0.34)",
              }}
              onFocus={(event) => {
                event.target.style.borderColor = "#0d6efd";
                event.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,0.16)";
              }}
              onBlur={(event) => {
                event.target.style.borderColor = errors.email ? "#d946ef" : "rgba(13,110,253,0.34)";
                event.target.style.boxShadow = "none";
              }}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  borderColor: errors.password ? "#d946ef" : "rgba(13,110,253,0.34)",
                }}
                onFocus={(event) => {
                  event.target.style.borderColor = "#0d6efd";
                  event.target.style.boxShadow = "0 0 0 4px rgba(13,110,253,0.16)";
                }}
                onBlur={(event) => {
                  event.target.style.borderColor = errors.password ? "#d946ef" : "rgba(13,110,253,0.34)";
                  event.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}
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
            {loading ? "Ingresando..." : "Ingresar"}
          </motion.button>

          <p style={styles.linkText}>
            ¿No tenés cuenta? <Link to="/register" style={styles.link}>Registrate</Link>
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
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(13,110,253,0.16) 0%, transparent 70%)",
    top: "-100px",
    left: "-100px",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
    bottom: "-100px",
    right: "-100px",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(10, 14, 24, 0.86)",
    backdropFilter: "blur(20px)",
    borderRadius: "18px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
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
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(13,110,253,0.06)",
    border: "1px solid rgba(13,110,253,0.34)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
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
    marginTop: "8px",
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
