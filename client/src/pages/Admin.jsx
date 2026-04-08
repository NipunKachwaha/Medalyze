import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PageLayout from "../components/PageLayout";
import { getPendingPrices, approvePrice, rejectPrice } from "../api/prices";
import { checkPriceAnomaly } from "../api/ai";
import toast from "react-hot-toast";

const Admin = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [anomalies, setAnomalies] = useState({});
  const listRef = useRef(null);

  const fetchPending = async () => {
    try {
      const res = await getPendingPrices();
      setPending(res.data || []);
    } catch (err) {
      toast.error("Failed to load pending prices");
    } finally {
      setLoading(false);
    }
  };

  // Check anomalies for all pending prices
  useEffect(() => {
    const checkAnomalies = async () => {
      if (pending.length === 0) return;

      const anomalyResults = {};

      for (const price of pending) {
        try {
          const result = await checkPriceAnomaly(
            price.product?._id,
            price.price,
            price.location?.city
          );
          if (result.isAnomaly) {
            anomalyResults[price._id] = result;
          }
        } catch (err) {
          // Silently skip if anomaly check fails
          console.warn("Anomaly check failed for", price._id);
        }
      }

      setAnomalies(anomalyResults);
    };

    checkAnomalies();
  }, [pending]);

  useEffect(() => {
    fetchPending();
  }, []);

  useEffect(() => {
    if (!loading && listRef.current?.children) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" },
      );
    }
  }, [loading, pending]);

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await approvePrice(id);
      toast.success("Price approved successfully!");
      gsap.to(`#card-${id}`, {
        opacity: 0,
        x: 100,
        duration: 0.3,
        onComplete: fetchPending,
      });
    } catch (err) {
      toast.error("Failed to approve price");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await rejectPrice(id);
      toast.success("Price rejected successfully!");
      gsap.to(`#card-${id}`, {
        opacity: 0,
        x: -100,
        duration: 0.3,
        onComplete: fetchPending,
      });
    } catch (err) {
      toast.error("Failed to reject price");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <PageLayout
      title="🛡️ Admin Panel"
      subtitle="Moderate and approve price submissions"
    >
      {/* Stats Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Pending Review",
            value: pending.length,
            icon: "⏳",
            color: "#f59e0b",
          },
          { label: "Approved Today", value: "—", icon: "✅", color: "#10b981" },
          { label: "Rejected Today", value: "—", icon: "❌", color: "#ef4444" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.25rem",
              border: "1px solid #ffe4d6",
              boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#fff3ee",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                border: "1.5px solid #ffe4d6",
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  color: "#e05c2a",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Prices */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #ffe4d6",
          boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            background: "#fff3ee",
            borderBottom: "1px solid #ffe4d6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: "700",
              color: "#e05c2a",
            }}
          >
            ⏳ Pending Price Submissions
          </h3>
          <span
            style={{
              background: "#e05c2a",
              color: "#fff",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "700",
            }}
          >
            {pending.length} pending
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#e05c2a",
              fontSize: "1.1rem",
            }}
          >
            Loading pending prices...
          </div>
        ) : pending.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#9ca3af",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <div style={{ fontWeight: "600", fontSize: "1rem" }}>
              All caught up!
            </div>
            <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
              No pending price submissions to review
            </div>
          </div>
        ) : (
          <div ref={listRef}>
            {pending.map((price, i) => (
              <div
                key={price._id}
                id={`card-${price._id}`}
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom:
                    i < pending.length - 1 ? "1px solid #fff3ee" : "none",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
                  alignItems: "center",
                  gap: "1rem",
                  fontSize: "0.9rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff8f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                {/* Product */}
                <div>
                  <div style={{ fontWeight: "700", color: "#111" }}>
                    {price.product?.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    {price.product?.manufacturer}
                  </div>
                </div>

                {/* City */}
                <div style={{ color: "#6b7280" }}>
                  📍 {price.location?.city}
                </div>

                {/* Price with Anomaly Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      color: anomalies[price._id] ? "#dc2626" : "#e05c2a",
                      fontSize: "1rem",
                    }}
                  >
                    ₹{price.price}
                  </div>
                  {anomalies[price._id] && (
                    <div
                      style={{
                        background: "#fef2f2",
                        color: "#dc2626",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        border: "1px solid #fecaca",
                      }}
                      title={anomalies[price._id].reason || "Price seems unusual"}
                    >
                      ⚠️ Anomaly
                    </div>
                  )}
                </div>

                {/* Pharmacy */}
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                  {price.pharmacyName || "—"}
                </div>

                {/* Submitted By */}
                <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                  👤 {price.submittedBy?.name}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleApprove(price._id)}
                    disabled={processing === price._id}
                    style={{
                      padding: "0.4rem 0.85rem",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(price._id)}
                    disabled={processing === price._id}
                    style={{
                      padding: "0.4rem 0.85rem",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Admin;
