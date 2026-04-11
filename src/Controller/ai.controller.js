import generateContent from "../services/ai.service.js";
import User from "../models/user.model.js";
import Code from "../models/code.model.js";

const getReview = async (req, res) => {
  try {
    const { code, userId, email } = req.body;
    
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
    
    // 3. Database Operations (if User is logged in)
    if (userId) {
      // Ensure user exists
      await User.findOneAndUpdate(
        { clerkId: userId },
        { clerkId: userId, email: email || '' },
        { upsert: true, new: true }
      );
      
      // Save code history
      await Code.create({
        userId: userId,
        query: code,
        response: response
      });
    }
    
    // 4. Successful Response
    return res.status(200).json({ 
      success: true,
      response: response 
    });

  } catch (err) {
    console.error("[GetReview Error]:", err);

    // 5. Detailed Error Handling
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

const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    
    const history = await Code.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, history });
  } catch (err) {
    console.error("[GetHistory Error]:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
};

export default { getReview, getHistory };
