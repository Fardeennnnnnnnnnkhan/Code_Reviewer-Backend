import { analyzeImageWithGemini } from "../services/imageai.service.js";
import User from "../models/user.model.js";
import Code from "../models/code.model.js";
import Activity from "../models/activity.model.js";

const analyzeImageCode = async (req, res) => {
  try {
    const { imageUrl, userId, email } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Image URL is required for analysis."
      });
    }

    const rawResponse = await analyzeImageWithGemini(imageUrl);
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawResponse);
    } catch (e) {
      throw new Error("Failed to parse response from Gemini as valid JSON.");
    }

    // Convert the exact JSON to the markdown schema `feedback` format.
    // This allows exact UI component rendering reuse without regressions.
    const feedbackMarkdown = `## 🔍 Visual Code Analysis
**Language Detected:** ${parsedResponse.language || 'Unknown'}

### 📝 Extracted Code
\`\`\`${(parsedResponse.language || '').toLowerCase()}
${parsedResponse.extractedCode || 'No code detected'}
\`\`\`

### 🐛 Bugs & Critical Issues
${parsedResponse.errors && parsedResponse.errors.length > 0 ? parsedResponse.errors.map(err => `- ${err}`).join('\n') : 'No critical errors detected.'}

### 💡 Suggestions & Optimization
${parsedResponse.suggestions && parsedResponse.suggestions.length > 0 ? parsedResponse.suggestions.map(sug => `- ${sug}`).join('\n') : 'No specific suggestions.'}

### ✨ Corrected & Clean Code
\`\`\`${(parsedResponse.language || '').toLowerCase()}
${parsedResponse.fixedCode || 'No corrected code provided'}
\`\`\`
`;

    // Add exactly what Frontend uses under parsedResponse.feedback
    parsedResponse.feedback = feedbackMarkdown;

    // Database tracking
    if (userId) {
      await User.findOneAndUpdate(
        { clerkId: userId },
        { clerkId: userId, email: email || '' },
        { upsert: true, new: true }
      );

      await Code.create({
        userId: userId,
        query: `Image URL: ${imageUrl}`,
        response: JSON.stringify(parsedResponse),
        scores: { readability: 0, timeComplexity: 0, spaceComplexity: 0, bestPractices: 0, security: 0 },
        totalScore: 0
      });

      const tzOffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
      await Activity.findOneAndUpdate(
        { userId, date: localISOTime },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
    }

    return res.status(200).json({
      success: true,
      parsedResponse: parsedResponse // the UI relies on parsedResponse.feedback
    });

  } catch (error) {
    console.error("[AnalyzeImageCode Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze image."
    });
  }
};

export default { analyzeImageCode };
