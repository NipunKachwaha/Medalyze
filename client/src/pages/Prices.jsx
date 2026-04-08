import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import PageLayout from "../components/PageLayout";
import { getPrices, submitPrice } from "../api/prices";
import { getProducts } from "../api/products";
import { getLocations } from "../api/locations";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Prices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [filters, setFilters] = useState({
    drug: searchParams.get("drug") || "",
    city: searchParams.get("city") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  });
  const [form, setForm] = useState({
    product: "",
    location: "",
    price: "",
    pharmacyName: "",
  });
  const { user } = useAuthStore();
  const listRef = useRef(null);
  const formRef = useRef(null);

  // Handle AI query from URL
  useEffect(() => {
    const aiQueryParam = searchParams.get("aiQuery");
    if (aiQueryParam) {
      setAiQuery(aiQueryParam);
    }
  }, [searchParams]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await getPrices({
        drug: filters.drug,
        city: filters.city,
        from: filters.from,
        to: filters.to,
      });
      setPrices(res.data || []);
    } catch (err) {
      toast.error("Failed to load prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [productsRes, locationsRes] = await Promise.all([
          getProducts(),
          getLocations(),
        ]);
        setProducts(productsRes.data || []);
        setLocations(locationsRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitial();
    fetchPrices();
  }, []);

  useEffect(() => {
    if (!loading && listRef.current?.children) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" },
      );
    }
  }, [loading, prices]);

  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.95, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" },
      );
    }
  }, [showForm]);

  const handleSearch = () => {
    setLoading(true);
    fetchPrices();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPrice(form);
      toast.success("Price submitted for review!");
      setShowForm(false);
      setForm({ product: "", location: "", price: "", pharmacyName: "" });
      fetchPrices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit price");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid #ffe4d6",
    borderRadius: "8px",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
    color: "#111",
    background: "#fff",
  };

  return (
    <PageLayout
      title="💰 Prices"
      subtitle="Search and compare pharmaceutical prices"
    >
      {/* AI Query Indicator */}
      {aiQuery && (
        <div
          style={{
            background: "#fff3ee",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
            border: "1px solid #ffe4d6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🧠</span>
            <div>
              <span style={{ fontWeight: "600", color: "#e05c2a", fontSize: "0.9rem" }}>
                AI Search:
              </span>
              <span style={{ marginLeft: "0.5rem", color: "#374151", fontSize: "0.9rem" }}>
                "{aiQuery}"
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setAiQuery("");
              searchParams.delete("aiQuery");
              setSearchParams(searchParams);
            }}
            style={{
              padding: "0.4rem 0.75rem",
              background: "#fff",
              color: "#6b7280",
              border: "1px solid #ffe4d6",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "500",
            }}
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Search Filters */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          border: "1px solid #ffe4d6",
          boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <input
            placeholder="🔍 Search drug name..."
            value={filters.drug}
            style={inputStyle}
            onChange={(e) =>
              setFilters((f) => ({ ...f, drug: e.target.value }))
            }
          />
          <input
            placeholder="📍 Filter by city..."
            value={filters.city}
            style={inputStyle}
            onChange={(e) =>
              setFilters((f) => ({ ...f, city: e.target.value }))
            }
          />
          <input
            type="date"
            value={filters.from}
            style={inputStyle}
            onChange={(e) =>
              setFilters((f) => ({ ...f, from: e.target.value }))
            }
          />
          <input
            type="date"
            value={filters.to}
            style={inputStyle}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => {
              setFilters({ drug: "", city: "", from: "", to: "" });
              fetchPrices();
            }}
            style={{
              padding: "0.6rem 1.25rem",
              background: "#fff3ee",
              color: "#e05c2a",
              border: "1.5px solid #ffe4d6",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
            }}
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            style={{
              padding: "0.6rem 1.25rem",
              background: "#e05c2a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
            }}
          >
            Search
          </button>
          {["pharmacist", "analyst", "admin"].includes(user?.role) && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "0.6rem 1.25rem",
                background: "#e05c2a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              {showForm ? "✕ Cancel" : "➕ Submit Price"}
            </button>
          )}
        </div>
      </div>

      {/* Submit Price Form */}
      {showForm && (
        <div
          ref={formRef}
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            border: "1px solid #ffe4d6",
            boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
          }}
        >
          <h3
            style={{
              margin: "0 0 1.25rem",
              color: "#e05c2a",
              fontWeight: "700",
            }}
          >
            Submit New Price
          </h3>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <select
                required
                value={form.product}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, product: e.target.value }))
                }
              >
                <option value="">Select product *</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                required
                value={form.location}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              >
                <option value="">Select location *</option>
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.city}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price (₹) *"
                required
                min="0"
                value={form.price}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
              <input
                placeholder="Pharmacy name (optional)"
                value={form.pharmacyName}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pharmacyName: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "0.75rem 2rem",
                background: "#e05c2a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              Submit Price
            </button>
          </form>
        </div>
      )}

      {/* Prices Table */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#e05c2a",
            fontSize: "1.1rem",
          }}
        >
          Loading prices...
        </div>
      ) : prices.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #ffe4d6",
            color: "#9ca3af",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💰</div>
          <div style={{ fontWeight: "600", fontSize: "1rem" }}>
            No approved prices found
          </div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Submit a price or adjust your search filters
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #ffe4d6",
            boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: "1rem 1.5rem",
              background: "#fff3ee",
              borderBottom: "1px solid #ffe4d6",
              fontWeight: "700",
              fontSize: "0.8rem",
              color: "#e05c2a",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <div>Product</div>
            <div>City</div>
            <div>Price</div>
            <div>Pharmacy</div>
            <div>Date</div>
          </div>

          {/* Table Rows */}
          <div ref={listRef}>
            {prices.map((price, i) => (
              <div
                key={price._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                  padding: "1rem 1.5rem",
                  borderBottom:
                    i < prices.length - 1 ? "1px solid #fff3ee" : "none",
                  alignItems: "center",
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
                <div>
                  <div style={{ fontWeight: "600", color: "#111" }}>
                    {price.product?.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    {price.product?.manufacturer}
                  </div>
                </div>
                <div style={{ color: "#6b7280" }}>
                  📍 {price.location?.city}
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    color: "#e05c2a",
                    fontSize: "1rem",
                  }}
                >
                  ₹{price.price}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                  {price.pharmacyName || "—"}
                </div>
                <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                  {new Date(price.recordedAt).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Prices;
