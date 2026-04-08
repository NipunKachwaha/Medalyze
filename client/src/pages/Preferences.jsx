import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import PageLayout from "../components/PageLayout";
import { parseNaturalSearch } from "../api/ai";
import toast from "react-hot-toast";

const Preferences = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const exampleQueries = [
    "Paracetamol under 50 rupees in Delhi",
    "Antibiotics cheaper than 100 rupees in Mumbai",
    "Pain killers between 30 and 60 rupees in Bangalore",
    "Vitamin supplements in Chennai",
  ];

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      const result = await parseNaturalSearch(searchQuery);

      // Save to recent searches
      const updatedRecent = [
        { query: searchQuery, timestamp: Date.now() },
        ...recentSearches.filter((s) => s.query !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));

      // Build query params for Prices page
      const params = new URLSearchParams();
      if (result.drug) params.set("drug", result.drug);
      if (result.city) params.set("city", result.city);
      if (result.minPrice) params.set("from", result.minPrice);
      if (result.maxPrice) params.set("to", result.maxPrice);
      params.set("aiQuery", searchQuery);

      // Redirect to Prices page with filters
      navigate(`/prices?${params.toString()}`);
    } catch {
      toast.error("Could not understand your query. Try rephrasing it.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    handleSearch(example);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    toast.success("Recent searches cleared");
  };

  // Animation on mount
  const containerRef = useRef(null);
  useState(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <PageLayout
      title="🤖 AI Search"
      subtitle="Search medicines using natural language"
    >
      <div ref={containerRef}>
        {/* AI Search Box */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "1.5rem",
            border: "1px solid #ffe4d6",
            boxShadow: "0 4px 16px rgba(224,92,42,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #e05c2a, #ff8c5a)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              🧠
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#111",
                }}
              >
                Natural Language Search
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#6b7280",
                }}
              >
                Type like you speak — AI will understand
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div
            style={{
              position: "relative",
              marginBottom: "1rem",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 'Paracetamol under 50 rupees in Delhi'"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem 1.25rem 1rem 3rem",
                border: "2px solid #ffe4d6",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                background: loading ? "#f9fafb" : "#fff",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#e05c2a";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ffe4d6";
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1.25rem",
              }}
            >
              🔍
            </span>
          </div>

          {/* Search Button */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              style={{
                flex: 1,
                
                padding: "0.85rem",
                background: loading || !query.trim() ? "#f3f4f6" : "#e05c2a",
                color: loading || !query.trim() ? "#9ca3af" : "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: loading || !query.trim() ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Understanding...
                </>
              ) : (
                <>🚀 Search with AI</>
              )}
            </button>
            <button
              onClick={() => setQuery("")}
              style={{
                padding: "0.85rem 1.25rem",
                background: "#fff3ee",
                color: "#e05c2a",
                border: "1.5px solid #ffe4d6",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              Clear
            </button>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* Example Queries */}
        <div
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
              margin: "0 0 1rem",
              fontSize: "1rem",
              fontWeight: "700",
              color: "#e05c2a",
            }}
          >
            💡 Try these examples
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.75rem",
            }}
          >
            {exampleQueries.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(example)}
                style={{
                  padding: "0.75rem 1rem",
                  background: "#fff8f5",
                  border: "1px solid #ffe4d6",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  color: "#374151",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff3ee";
                  e.currentTarget.style.borderColor = "#e05c2a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff8f5";
                  e.currentTarget.style.borderColor = "#ffe4d6";
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1px solid #ffe4d6",
              boxShadow: "0 2px 8px rgba(224,92,42,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
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
                🕐 Recent Searches
              </h3>
              <button
                onClick={handleClearRecent}
                style={{
                  padding: "0.4rem 0.75rem",
                  background: "transparent",
                  color: "#9ca3af",
                  border: "1px solid #f3f4f6",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Clear All
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recentSearches.map((search, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setQuery(search.query);
                    handleSearch(search.query);
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: "#374151",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff3ee";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                >
                  <span>🔍</span>
                  <span style={{ flex: 1 }}>{search.query}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    {new Date(search.timestamp).toLocaleDateString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
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
              margin: "0 0 1rem",
              fontSize: "1rem",
              fontWeight: "700",
              color: "#e05c2a",
            }}
          >
            ⚙️ How it works
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "✍️", text: "Type your query in plain English" },
              { icon: "🧠", text: "AI extracts drug name, city, and price range" },
              { icon: "🔍", text: "Results appear on the Prices page with filters" },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#fff3ee",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    border: "1px solid #ffe4d6",
                  }}
                >
                  {step.icon}
                </div>
                <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Preferences;