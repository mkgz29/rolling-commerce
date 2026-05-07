import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!email.includes("@")) newErrors.email = "Email must contain @.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8) newErrors.password = "Minimum 8 characters.";
    if (!acceptTerms) newErrors.terms = "You must agree to the terms.";
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
        title: "Welcome back!",
        text: `Logged in as ${email}`,
        background: "#0f0f1a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate(from, { replace: true }));
    } catch (submitError) {
      setErrors({
        submit:
          submitError?.message ||
          "Login failed. Please check your credentials and try again.",
      });
    }
  };

  return (
    <div style={styles.page}>
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...styles.input,
                borderColor: errors.email ? "#d946ef" : "rgba(124,58,237,0.3)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c3aed";
                e.target.style.boxShadow = "0 0 0 4px rgba(124,58,237,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? "#d946ef" : "rgba(124,58,237,0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  borderColor: errors.password ? "#d946ef" : "rgba(124,58,237,0.3)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7c3aed";
                  e.target.style.boxShadow = "0 0 0 4px rgba(124,58,237,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? "#d946ef" : "rgba(124,58,237,0.3)";
                  e.target.style.boxShadow = "none";
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

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#7c3aed",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#d1d5db", fontSize: "14px" }}>
                I agree to the <Link to="/terms" style={{ color: "#a78bfa", textDecoration: "underline" }}>Terms and Conditions</Link>
              </span>
            </div>
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
            {loading ? "Logging in..." : "Sign In"}
          </motion.button>

          <p style={styles.linkText}>
            Don't have an account? <Link to="/register" style={styles.link}>Register now</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a14 0%, #0f0f1a 50%, #0a0a14 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
    top: "-100px",
    left: "-100px",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%)",
    bottom: "-100px",
    right: "-100px",
    pointerEvents: "none",
  },
  card: {
    background: "linear-gradient(135deg, rgba(20,20,35,0.95) 0%, rgba(10,10,20,0.95) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
    border: "1px solid rgba(124,58,237,0.2)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)",
    position: "relative",
    zIndex: 1,
  },
  logoCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff",
    boxShadow: "0 0 30px rgba(124,58,237,0.4)",
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px",
    background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#6b7280",
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
    background: "rgba(124,58,237,0.05)",
    border: "1px solid rgba(124,58,237,0.3)",
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
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px 8px",
  },
  error: {
    color: "#d946ef",
    fontSize: "13px",
    margin: "6px 0 0",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
    marginTop: "8px",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  linkText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: "#a78bfa",
    textDecoration: "none",
    fontWeight: "600",
  },
};
