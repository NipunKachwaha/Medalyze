import { useState, useRef } from "react";
import { gsap } from "gsap";
import { getDrugSummary } from "../api/ai";
import toast from "react-hot-toast";

const AiSummaryCard = ({ productId, productName }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const cardRef = useRef(null);

  const handleGetSummary = async () => {
    if (summary) {
      setShow(!show);
      return;
    }
    setLoading(true);
    try {
      const data = await getDrugSummary(productId);
      setSummary(data.summary);
      setShow(true);
      setTimeout(() => {
        if (cardRef.current) {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          );
        }
      }, 50);
    } catch (err) {
      toast.error("AI summary unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const parseSummary = (text) => {
    if (!text) return [];
    const sections = [
      { key: "WHAT IT TREATS", icon: "🎯", color: "#10b981" },
      { key: "HOW IT WORKS", icon: "⚙️", color: "#3b82f6" },
      { key: "COMMON SIDE EFFECTS", icon: "⚠️", color: "#f59e0b" },
      { key: "STORAGE TIPS", icon: "📦", color: "#8b5cf6" },
      { key: "IMPORTANT WARNING", icon: "🚨", color: "#ef4444" },
    ];
    return sections
      .map((section) => {
        const regex = new RegExp(`${section.key}:\\s*(.+?)(?=\\n[A-Z]|$)`, "s");
        const match = text.match(regex);
        return {
          ...section,
          value: match ? match[1].trim() : null,
        };
      })
      .filter((s) => s.value);
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      {/* AI Button */}
      <button
        onClick={handleGetSummary}
        disabled={loading}
        style={{
          padding: "0.4rem 0.85rem",
          background: loading ? "#f3f4f6" : "#fff3ee",
          color: loading ? "#9ca3af" : "#e05c2a",
          border: "1.5px solid #ffe4d6",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "0.8rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "all 0.2s",
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: "12px",
                height: "12px",
                border: "2px solid #e05c2a",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Asking AI...
          </>
        ) : (
          <>🤖 {show ? "Hide AI Info" : "AI Drug Info"}</>
        )}
      </button>

      {/* Spinner Animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Summary Card */}
      {show && summary && (
        <div
          ref={cardRef}
          style={{
            marginTop: "0.75rem",
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #ffe4d6",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(224,92,42,0.1)",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: "#fff3ee",
              padding: "0.75rem 1rem",
              borderBottom: "1px solid #ffe4d6",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1rem" }}>🤖</span>
            <span
              style={{
                fontWeight: "700",
                fontSize: "0.85rem",
                color: "#e05c2a",
              }}
            >
              AI Drug Information — {productName}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.7rem",
                color: "#9ca3af",
                background: "#f9fafb",
                padding: "0.2rem 0.5rem",
                borderRadius: "20px",
                border: "1px solid #f3f4f6",
              }}
            >
              Powered by Groq AI
            </span>
          </div>

          {/* Summary Sections */}
          <div style={{ padding: "0.75rem 1rem" }}>
            {parseSummary(summary).map((section, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  padding: "0.5rem 0",
                  borderBottom:
                    i < parseSummary(summary).length - 1
                      ? "1px solid #fff3ee"
                      : "none",
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>
                  {section.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      color: section.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {section.key}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#374151",
                      lineHeight: 1.5,
                    }}
                  >
                    {section.value}
                  </div>
                </div>
              </div>
            ))}

            {/* Disclaimer */}
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 0.75rem",
                background: "#fff3ee",
                borderRadius: "8px",
                fontSize: "0.75rem",
                color: "#9ca3af",
                border: "1px solid #ffe4d6",
              }}
            >
              ⚕️ This is AI-generated information for reference only. Always
              consult a doctor before taking any medication.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSummaryCard;
