import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import bgVideo from "../assets/bg-video.mp4";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data.token, data.user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f3f4f6",
        overflow: "hidden",
      }}
    >
      {/* Left Panel - Video Background with tilt */}
      <div
        style={{
          flex: "0 0 55%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px 24px 24px 24px",
          borderTop: "4px solid rgba(224, 92, 42, 0.8)",
          borderRight: "4px solid rgba(224, 92, 42, 0.8)",
          borderBottom: "4px solid rgba(224, 92, 42, 0.8)",
          borderLeft: "none",
          transform: "skewY(-2deg) perspective(1200px) rotateY(-2deg)",
          transformOrigin: "left center",
          boxShadow:
            "0 0 0 6px rgba(224, 92, 42, 0.6), 0 20px 60px rgba(255, 255, 255, 0.4)",
          border: "4px solid rgba(224, 92, 42, 0.8)",
          margin: "1.5rem",
          zIndex: 2,
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.15))",
          }}
        />

        {/* Top Left Logo */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            zIndex: 3,
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#e05c2a",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1.1rem",
              }}
            >
              P
            </div>
            <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>
              PharmaTracker
            </span>
          </div>
        </div>

        {/* Bottom Text */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "2.5rem",
            right: "2.5rem",
            zIndex: 3,
            color: "#fff",
          }}
        >
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            Track Drug Prices Across India
          </h1>
          <p style={{ fontSize: "0.95rem", opacity: 0.75 }}>
            Real-time pharmaceutical pricing data for consumers, pharmacists and
            analysts.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
          background: "#fff",
          overflowY: "auto",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: "800",
              marginBottom: "0.25rem",
              color: "#111",
            }}
          >
            Hi, Welcome Back 👋
          </h2>
          <p
            style={{ color: "#888", marginBottom: "2rem", fontSize: "0.95rem" }}
          >
            Login to your account to continue
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#111",
                }}
              />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#111",
                }}
              />
            </div>
            <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
              <span
                style={{
                  color: "#e05c2a",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: "#e05c2a",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "1.5rem",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span
              style={{
                padding: "0 1rem",
                color: "#888",
                fontSize: "0.85rem",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Social Login Buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
          >
            {/* Google */}
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#111",
              }}
            >
              <img
                src="https://www.google.com/favicon.ico"
                width="18"
                height="18"
                alt="Google"
              />
              Continue with Google
            </button>

            {/* Facebook */}
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#111",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>

            {/* GitHub */}
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#111",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#333">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>

            {/* Apple */}
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                background: "#000",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "0.9rem",
              marginTop: "1.5rem",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#e05c2a",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
