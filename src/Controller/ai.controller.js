import generateContent  from "../services/ai.service.js";

const getReview = async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const response = await generateContent(code);
    res.send({ response });
  } catch (err) {
    console.error(err);
    if (err.status === 429) {
      return res.status(429).json({ error: "API Rate Limit Exceeded. Please try again in a minute." });
    }
    res.status(500).json({ error: err.message || "Failed to generate response" });
  }
};

export default { getReview };
