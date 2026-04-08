import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import PageLayout from "../components/PageLayout";
import StatCard from "../components/StatCard";
import { getProducts } from "../api/products";
import { getLocations } from "../api/locations";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    prices: 0,
    locations: 0,
    pending: 0,
  });
  const [priceChartData, setPriceChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // GSAP Refs
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, locationsRes] = await Promise.all([
          getProducts(),
          getLocations(),
        ]);
        setStats((s) => ({
          ...s,
          products: productsRes.total || 0,
          locations: locationsRes.total || 0,
        }));
        setPriceChartData([
          { date: "Jan", avgPrice: 45 },
          { date: "Feb", avgPrice: 52 },
          { date: "Mar", avgPrice: 48 },
          { date: "Apr", avgPrice: 61 },
          { date: "May", avgPrice: 55 },
          { date: "Jun", avgPrice: 67 },
          { date: "Jul", avgPrice: 72 },
        ]);
        setCategoryData([
          { category: "Analgesic", count: 12 },
          { category: "Antibiotic", count: 8 },
          { category: "Antiviral", count: 5 },
          { category: "Vitamin", count: 9 },
          { category: "Antacid", count: 6 },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header animation
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6 },
    );

    // Stat cards stagger animation
    tl.fromTo(
      statsRef.current?.children,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 },
      "-=0.3",
    );

    // Charts animation
    tl.fromTo(
      chartsRef.current?.children,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.15 },
      "-=0.2",
    );

    // Quick actions animation
    tl.fromTo(
      actionsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.2",
    );
  }, [loading]);

  return (
    <PageLayout
      title={`Welcome back, ${user?.name}! 👋`}
      subtitle="Here is what is happening with PharmaTracker today"
    >
      {/* Stat Cards */}
      <div
        ref={statsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total Products"
          value={loading ? "..." : stats.products}
          icon="💊"
          color="#e05c2a"
          subtitle="Registered drugs"
        />
        <StatCard
          title="Price Records"
          value={loading ? "..." : stats.prices}
          icon="💰"
          color="#e05c2a"
          subtitle="Approved entries"
        />
        <StatCard
          title="Locations"
          value={loading ? "..." : stats.locations}
          icon="📍"
          color="#e05c2a"
          subtitle="Cities tracked"
        />
        <StatCard
          title="Pending Review"
          value={loading ? "..." : stats.pending}
          icon="⏳"
          color="#e05c2a"
          subtitle="Awaiting approval"
        />
      </div>

      {/* Charts Row */}
      <div
        ref={chartsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Price Trend Chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            border: "1px solid #ffe4d6",
            boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
          }}
        >
          <h3
            style={{
              margin: "0 0 1.5rem",
              fontSize: "1rem",
              fontWeight: "700",
              color: "#111",
            }}
          >
            📈 Average Price Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fff3ee" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(v) => [`₹${v}`, "Avg Price"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #ffe4d6",
                  fontSize: "0.85rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="avgPrice"
                stroke="#e05c2a"
                strokeWidth={2.5}
                dot={{ fill: "#e05c2a", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Bar Chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            border: "1px solid #ffe4d6",
            boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
          }}
        >
          <h3
            style={{
              margin: "0 0 1.5rem",
              fontSize: "1rem",
              fontWeight: "700",
              color: "#111",
            }}
          >
            📊 Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fff3ee" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #ffe4d6",
                  fontSize: "0.85rem",
                }}
              />
              <Bar
                dataKey="count"
                fill="#e05c2a"
                radius={[6, 6, 0, 0]}
                name="Products"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        ref={actionsRef}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "1.5rem",
          border: "1px solid #ffe4d6",
          boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
        }}
      >
        <h3
          style={{
            margin: "0 0 1rem",
            fontSize: "1rem",
            fontWeight: "700",
            color: "#111",
          }}
        >
          ⚡ Quick Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {[
            {
              label: "Add Product",
              icon: "➕",
              path: "/products",
              desc: "Register new drug",
            },
            {
              label: "Submit Price",
              icon: "💲",
              path: "/prices",
              desc: "Add price record",
            },
            {
              label: "View Locations",
              icon: "🗺️",
              path: "/locations",
              desc: "Browse cities",
            },
            {
              label: "Search Prices",
              icon: "🔍",
              path: "/prices",
              desc: "Find best prices",
            },
          ].map((action, i) => (
            <div
              key={action.label}
              onClick={() => navigate(action.path)}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  background: "#e05c2a",
                  duration: 0.2,
                  ease: "power2.out",
                });
                gsap.to(e.currentTarget.querySelectorAll("div"), {
                  color: "#fff",
                  duration: 0.2,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  background: "#fff3ee",
                  duration: 0.2,
                  ease: "power2.out",
                });
                gsap.to(e.currentTarget.querySelectorAll("div"), {
                  color: "#111",
                  duration: 0.2,
                });
              }}
              style={{
                padding: "1.25rem",
                borderRadius: "12px",
                background: "#fff3ee",
                border: "1.5px solid #ffe4d6",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                {action.icon}
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  marginBottom: "0.25rem",
                  color: "#111",
                }}
              >
                {action.label}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                }}
              >
                {action.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
