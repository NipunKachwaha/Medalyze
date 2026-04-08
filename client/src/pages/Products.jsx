import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PageLayout from "../components/PageLayout";
import { getProducts, createProduct, deleteProduct } from "../api/products";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import AiSummaryCard from "../components/AiSummaryCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    category: "",
    unit: "",
    description: "",
  });
  const { user } = useAuthStore();
  const listRef = useRef(null);
  const formRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ name: search });
      setProducts(res.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  useEffect(() => {
    if (!loading && listRef.current?.children) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" },
      );
    }
  }, [loading, products]);

  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.95, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" },
      );
    }
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(form);
      toast.success("Product created successfully!");
      setShowForm(false);
      setForm({
        name: "",
        genericName: "",
        manufacturer: "",
        category: "",
        unit: "",
        description: "",
      });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
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
      title="💊 Products"
      subtitle="Browse and manage pharmaceutical products"
    >
      {/* Search and Add Bar */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by drug name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            flex: 1,
            boxShadow: "0 2px 8px rgba(224,92,42,0.06)",
          }}
        />
        {["pharmacist", "analyst", "admin"].includes(user?.role) && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#e05c2a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            {showForm ? "✕ Cancel" : "➕ Add Product"}
          </button>
        )}
      </div>

      {/* Add Product Form */}
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
            Add New Product
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
              <input
                placeholder="Drug name *"
                required
                value={form.name}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                placeholder="Generic name"
                value={form.genericName}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, genericName: e.target.value }))
                }
              />
              <input
                placeholder="Manufacturer"
                value={form.manufacturer}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, manufacturer: e.target.value }))
                }
              />
              <select
                value={form.category}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option value="">Select category</option>
                <option value="analgesic">Analgesic</option>
                <option value="antibiotic">Antibiotic</option>
                <option value="antiviral">Antiviral</option>
                <option value="antacid">Antacid</option>
                <option value="vitamin">Vitamin</option>
                <option value="antifungal">Antifungal</option>
                <option value="eyelubricant">Eye Lubricant</option>
                <option value="other">Other</option>
              </select>
              <select
                value={form.unit}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unit: e.target.value }))
                }
              >
                <option value="">Select unit</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="ml">ML</option>
                <option value="strip">Strip</option>
                <option value="tube">Tube</option>
                <option value="bottle">Bottle</option>
                <option value="sachet">Sachet</option>
              </select>
              <input
                placeholder="Description"
                value={form.description}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
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
              Create Product
            </button>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#e05c2a",
            fontSize: "1.1rem",
          }}
        >
          Loading products...
        </div>
      ) : products.length === 0 ? (
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
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💊</div>
          <div style={{ fontWeight: "600", fontSize: "1rem" }}>
            No products found
          </div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Add your first product using the button above
          </div>
        </div>
      ) : (
        <div
          ref={listRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "1.25rem",
                border: "1px solid #ffe4d6",
                boxShadow: "0 2px 8px rgba(224,92,42,0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -4,
                  duration: 0.2,
                  boxShadow: "0 8px 24px rgba(224,92,42,0.15)",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.2,
                  boxShadow: "0 2px 8px rgba(224,92,42,0.06)",
                });
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "#fff3ee",
                    borderRadius: "8px",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.75rem",
                    color: "#e05c2a",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {product.category || "General"}
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      background: "#fff3ee",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.3rem 0.5rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "#e05c2a",
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Product Info */}
              <h3
                style={{
                  margin: "0 0 0.25rem",
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#111",
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                }}
              >
                {product.genericName || "No generic name"}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.manufacturer && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.6rem",
                      background: "#f9fafb",
                      borderRadius: "20px",
                      color: "#6b7280",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    🏭 {product.manufacturer}
                  </span>
                )}
                {product.unit && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.6rem",
                      background: "#f9fafb",
                      borderRadius: "20px",
                      color: "#6b7280",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    📦 {product.unit}
                  </span>
                )}
              </div>

              {/* AI Summary Card */}
              <AiSummaryCard
                productId={product._id}
                productName={product.name}
              />
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default Products;
