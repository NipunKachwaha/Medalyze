import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PageLayout from "../components/PageLayout";
import { getLocations, createLocation } from "../api/locations";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    city: "",
    region: "",
    state: "",
    country: "India",
    lat: "",
    lng: "",
  });
  const { user } = useAuthStore();
  const listRef = useRef(null);
  const formRef = useRef(null);

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data || []);
    } catch (err) {
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!loading && listRef.current?.children) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" },
      );
    }
  }, [loading, locations]);

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
      await createLocation(form);
      toast.success("Location created successfully!");
      setShowForm(false);
      setForm({
        city: "",
        region: "",
        state: "",
        country: "India",
        lat: "",
        lng: "",
      });
      fetchLocations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create location");
    }
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.state?.toLowerCase().includes(search.toLowerCase()),
  );

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
      title="📍 Locations"
      subtitle="Browse and manage city locations"
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
          placeholder="🔍 Search by city or state..."
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
            {showForm ? "✕ Cancel" : "➕ Add Location"}
          </button>
        )}
      </div>

      {/* Add Location Form */}
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
            Add New Location
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
                placeholder="City *"
                required
                value={form.city}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
              />
              <input
                placeholder="Region"
                value={form.region}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, region: e.target.value }))
                }
              />
              <input
                placeholder="State"
                value={form.state}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, state: e.target.value }))
                }
              />
              <input
                placeholder="Country"
                value={form.country}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
              />
              <input
                placeholder="Latitude (e.g. 28.6139)"
                type="number"
                step="any"
                value={form.lat}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lat: e.target.value }))
                }
              />
              <input
                placeholder="Longitude (e.g. 77.2090)"
                type="number"
                step="any"
                value={form.lng}
                style={inputStyle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lng: e.target.value }))
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
              Create Location
            </button>
          </form>
        </div>
      )}

      {/* Locations Grid */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#e05c2a",
            fontSize: "1.1rem",
          }}
        >
          Loading locations...
        </div>
      ) : filteredLocations.length === 0 ? (
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
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</div>
          <div style={{ fontWeight: "600", fontSize: "1rem" }}>
            No locations found
          </div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Add your first location using the button above
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
          {filteredLocations.map((location) => (
            <div
              key={location._id}
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
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "1.25rem",
                border: "1px solid #ffe4d6",
                boxShadow: "0 2px 8px rgba(224,92,42,0.06)",
              }}
            >
              {/* Location Icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "#fff3ee",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  marginBottom: "0.75rem",
                  border: "1.5px solid #ffe4d6",
                }}
              >
                📍
              </div>

              {/* City Name */}
              <h3
                style={{
                  margin: "0 0 0.25rem",
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#111",
                }}
              >
                {location.city}
              </h3>

              {/* Region */}
              {location.region && (
                <p
                  style={{
                    margin: "0 0 0.75rem",
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                  }}
                >
                  {location.region}
                </p>
              )}

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {location.state && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.6rem",
                      background: "#fff3ee",
                      borderRadius: "20px",
                      color: "#e05c2a",
                      border: "1px solid #ffe4d6",
                      fontWeight: "500",
                    }}
                  >
                    🏛️ {location.state}
                  </span>
                )}
                {location.country && (
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
                    🌍 {location.country}
                  </span>
                )}
                {location.coords?.coordinates?.length > 0 && (
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
                    🗺️ {location.coords.coordinates[1].toFixed(2)},
                    {location.coords.coordinates[0].toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default Locations;
