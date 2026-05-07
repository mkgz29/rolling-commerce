import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

 useEffect(() => {
    document.title = "Page Not Found 404";
  }, []);


  return (
    <div style={styles.page}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.wrapper}
      >
        {/* Número 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          style={styles.errorCode}
        >
          404
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={styles.title}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={styles.subtitle}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            style={styles.primaryBtn}
          >
            Go Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            style={styles.secondaryBtn}
          >
            Go Back
          </motion.button>
        </motion.div>
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
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
    top: "-200px",
    left: "-200px",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
    bottom: "-200px",
    right: "-200px",
    pointerEvents: "none",
  },
  wrapper: {
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    maxWidth: "500px",
  },
  errorCode: {
    fontSize: "clamp(100px, 20vw, 160px)",
    fontWeight: "900",
    background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 50%, #22d3ee 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1,
    marginBottom: "24px",
    filter: "drop-shadow(0 0 40px rgba(124,58,237,0.3))",
  },
  title: {
    color: "#fff",
    fontSize: "clamp(24px, 5vw, 36px)",
    fontWeight: "700",
    margin: "0 0 16px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0 0 40px",
  },
  primaryBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
    letterSpacing: "0.5px",
  },
  secondaryBtn: {
    padding: "14px 32px",
    background: "transparent",
    border: "1px solid rgba(124,58,237,0.4)",
    borderRadius: "12px",
    color: "#a78bfa",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.5px",
  },
};