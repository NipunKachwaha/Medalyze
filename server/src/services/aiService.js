const Groq = require("groq-sdk");

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// You can use "llama3-8b-8192", "llama3-70b-8192", or "mixtral-8x7b-32768" depending on your needs.
// Latest Llama 3.1 model jo fast aur active hai
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Feature 1 — Drug Info Summarizer
exports.getDrugSummary = async (drugName, manufacturer, category) => {
  try {
    console.log("🤖 Calling Groq API for:", drugName);
    console.log("🔑 API Key exists:", !!process.env.GROQ_API_KEY);

    const prompt = `Role: You are a reliable pharmaceutical information assistant for Indian users.
Task: Provide a brief, plain-English summary for the drug "${drugName}" (Manufacturer: "${manufacturer}", Category: "${category}").

Strict Rules:
1. NEVER provide dosage advice.
2. Keep each section strictly under 20 words.
3. Output EXACTLY the format below. Do not add conversational text, markdown formatting, or pleasantries.
4. If the drug is completely unknown, reply ONLY with: "Error: Drug information not found."

Format:
WHAT IT TREATS: [One simple sentence]
HOW IT WORKS: [One simple sentence]
COMMON SIDE EFFECTS: [Comma-separated list of max 5 effects]
STORAGE TIPS: [One simple sentence]
IMPORTANT WARNING: [One critical safety warning]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.2, // Low temperature for more factual, consistent responses
    });

    const text = completion.choices[0]?.message?.content || "";

    console.log("✅ Groq API response received");
    return { success: true, summary: text.trim() };
  } catch (err) {
    console.error("❌ Groq API Error:", err.message);
    return { success: false, summary: null, error: err.message };
  }
};

// Feature 2 — Natural Language Price Search
exports.parseNaturalSearch = async (query) => {
  try {
    console.log("🤖 Parsing natural search:", query);

    const prompt = `Role: You are a strict NLP parser for an Indian pharmaceutical pricing app.
Task: Extract search filters from the user's natural language query and output them as a valid JSON object.

Input Query: "${query}"
Current Reference Date: "${new Date().toISOString().split('T')[0]}"

Expected JSON Schema (Extract ONLY these fields):
- "drug": (string) Name of the medicine/drug mentioned.
- "city": (string) Name of the Indian city mentioned.
- "category": (string) Drug category (e.g., painkiller, antibiotics, generic).
- "from": (string) Start date in "YYYY-MM-DD" format.
- "to": (string) End date in "YYYY-MM-DD" format.

Strict Rules:
1. ONLY include keys that are clearly present in the query. If a field is missing, OMIT the key entirely (do not use null or "").
2. RESOLVE relative dates (like "yesterday", "last week", "past 3 days") accurately using the Current Reference Date.
3. If the query is completely unclear or unrelated, return exactly: {}
4. Output NOTHING but the raw JSON object. No markdown formatting, no code blocks and no conversational text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      temperature: 0,
      response_format: { type: "json_object" }, // Groq enforces valid JSON output here
    });

    const text = completion.choices[0]?.message?.content || "{}";

    console.log("✅ Groq parsed search:", text);
    try {
      return { success: true, filters: JSON.parse(text) };
    } catch {
      return { success: true, filters: {} };
    }
  } catch (err) {
    console.error("❌ Groq API Error:", err.message);
    return { success: false, filters: {}, error: err.message };
  }
};

// Feature 3 — Price Anomaly Detector
exports.checkPriceAnomaly = async (
  drugName,
  submittedPrice,
  avgPrice,
  city,
) => {
  try {
    console.log("🤖 Checking price anomaly for:", drugName);

    const ratio = submittedPrice / (avgPrice || submittedPrice);
    const isAnomaly = ratio < 0.3 || ratio > 3;

    if (!isAnomaly) {
      return { success: true, flagged: false, reason: null };
    }

    const prompt = `A price submission for "${drugName}" in ${city} is ₹${submittedPrice}.
                    The current average price is ₹${avgPrice}.
                    The ratio is ${ratio.toFixed(2)}x the average.
                    Write ONE short sentence explaining why this looks suspicious.
                    Start with "⚠️ Warning:" if suspicious or "✅ Looks fine:" if acceptable.
                    Be specific about the price difference.
                    Do not include any extra text or explanation.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.1,
    });

    const text = completion.choices[0]?.message?.content || "";

    console.log("✅ Groq anomaly check:", text.trim());
    return {
      success: true,
      flagged: true,
      reason: text.trim(),
      ratio: ratio.toFixed(2),
    };
  } catch (err) {
    console.error("❌ Groq API Error:", err.message);
    return { success: false, flagged: false, reason: null, error: err.message };
  }
};
