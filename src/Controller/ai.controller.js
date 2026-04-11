import generateContent from "../services/ai.service.js";

const getReview = async (req, res) => {
  try {
    const code = req.body.code;
    
    // 1. Input Validation
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: "Bad Request",
        message: "Source code is required in the request body." 
      });
    }

    // 2. Processing
    const response = await generateContent(code);
    
    // 3. Successful Response
    return res.status(200).json({ 
      success: true,
      response: response 
    });

  } catch (err) {
    console.error("[GetReview Error]:", err);

    // 4. Detailed Error Handling
    const statusCode = err.status || err.response?.status || 500;
    let errorMessage = "An unexpected error occurred during code review.";

    if (statusCode === 429) {
      errorMessage = "API Rate Limit Exceeded. Please wait and try again.";
    } else if (statusCode === 401 || statusCode === 403) {
      errorMessage = "Authentication failed with the AI service. Please check API keys.";
    } else if (err.message) {
      errorMessage = err.message;
    }

    return res.status(statusCode).json({ 
      success: false,
      error: err.name || "ServerError",
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    });
  }
};

export default { getReview };
