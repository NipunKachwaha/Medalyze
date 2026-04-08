import Sidebar from "./Sidebar";

const PageLayout = ({ children, title, subtitle }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#fff8f5",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "240px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            background: "#fff",
            padding: "1.25rem 2rem",
            borderBottom: "1px solid #ffe4d6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: "0 2px 8px rgba(224,92,42,0.06)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#111",
                margin: 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  margin: "0.15rem 0 0",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Current Date */}
          <div
            style={{
              fontSize: "0.85rem",
              color: "#e05c2a",
              background: "#fff3ee",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ffe4d6",
              fontWeight: "600",
            }}
          >
            📅{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "2rem", flex: 1 }}>{children}</div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 2rem",
            borderTop: "1px solid #ffe4d6",
            background: "#fff",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#9ca3af",
          }}
        >
          © 2026 Medalyze | Built by Nipun Kushwaha 🇮🇳
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
