import  express from  'express';
import aiController  from  '../Controller/ai.controller.js';
import ClaudeReview from '../Controller/ClaudeReview.js';
import getCohereReview from '../Controller/getCohereReview.js';
import openaiController from '../Controller/openai.controller.js';
const router = express.Router();

router.post('/get-review', aiController.getReview);
router.post('/get-cohere-review', getCohereReview.getCohereReview)
router.post('/get-claude-review', ClaudeReview.getClaudeReview)
router.post('/get-openai-review', openaiController.getOpenaiReview )

export default router