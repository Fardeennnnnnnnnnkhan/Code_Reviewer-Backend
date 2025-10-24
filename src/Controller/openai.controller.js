import generateCohereResponse from "../services/cohere.service.js";

const getOpenaiReview = async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const response = await generateCohereResponse(code);
    res.send({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

export default { getOpenaiReview };
