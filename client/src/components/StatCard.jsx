const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "1.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
        border: "1px solid #ffe4d6",
        flex: 1,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(224,92,42,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(224,92,42,0.08)";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "52px",
          height: "52px",
          background: "#fff3ee",
          border: "1.5px solid #ffe4d6",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "0.8rem",
            color: "#9ca3af",
            marginBottom: "0.25rem",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "#e05c2a",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              fontWeight: "500",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
