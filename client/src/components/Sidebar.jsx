import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import logo from "../../public/favicon.png";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "Products", path: "/products", icon: "💊" },
  { label: "Prices", path: "/prices", icon: "💰" },
  { label: "Locations", path: "/locations", icon: "📍" },
  { label: "AI Search", path: "/preferences", icon: "🤖" },
];

const adminItems = [{ label: "Admin Panel", path: "/admin", icon: "🛡️" }];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const currentPath = location?.pathname || "";

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #ffe4d6",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        fontFamily: "Segoe UI, sans-serif",
        boxShadow: "2px 0 12px rgba(224,92,42,0.06)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid #ffe4d6",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
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
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <img src={logo} alt="Medalyze logo" style={{ width: "24px", height: "24px" }} />
        </div>
        <span
          style={{
            fontWeight: "800",
            fontSize: "1rem",
            color: "#e05c2a",
          }}
        >
          Medalyze
        </span>
      </div>

      {/* User Info */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #ffe4d6",
          background: "#fff8f5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              background: "#e05c2a",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "1rem",
              color: "#fff",
            }}
          >
            {user && user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <div
              style={{
                fontWeight: "700",
                fontSize: "0.9rem",
                color: "#111",
              }}
            >
              {(user && user.name) || "User"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#e05c2a",
                textTransform: "capitalize",
                fontWeight: "500",
              }}
            >
              {(user && user.role) ? user.role : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              background:
                currentPath === item.path ? "#fff3ee" : "transparent",
              borderLeft:
                currentPath === item.path
                  ? "3px solid #e05c2a"
                  : "3px solid transparent",
              color: currentPath === item.path ? "#e05c2a" : "#6b7280",
              fontWeight: currentPath === item.path ? "700" : "500",
              transition: "all 0.2s",
            }}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(item.path);
              }
            }}
            aria-current={currentPath === item.path ? "page" : undefined}
            role="button"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* Admin Items */}
        {user && user.role && user.role.toLowerCase() === "admin" && (
          <>
            <div
              style={{
                padding: "0.75rem 1.5rem 0.25rem",
                fontSize: "0.7rem",
                color: "#e05c2a",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: "700",
              }}
            >
              Admin
            </div>
            {adminItems.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  background:
                    currentPath === item.path ? "#fff3ee" : "transparent",
                  borderLeft:
                    currentPath === item.path
                      ? "3px solid #e05c2a"
                      : "3px solid transparent",
                  color:
                    currentPath === item.path ? "#e05c2a" : "#6b7280",
                  fontWeight: currentPath === item.path ? "700" : "500",
                  transition: "all 0.2s",
                }}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(item.path);
                  }
                }}
                aria-current={currentPath === item.path ? "page" : undefined}
                role="button"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid #ffe4d6",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#fff3ee",
            color: "#e05c2a",
            border: "1.5px solid #ffe4d6",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
          type="button"
        >
          <span role="img" aria-label="Logout">
            🚪
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
