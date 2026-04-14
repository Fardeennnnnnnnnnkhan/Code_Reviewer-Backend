import express from 'express';
import aiController from '../Controller/ai.controller.js';
import imageAiController from '../Controller/imageai.controller.js';

const router = express.Router();

router.post('/get-review', aiController.getReview);
router.post('/analyze-image-code', imageAiController.analyzeImageCode);
router.get('/get-history', aiController.getHistory);

export default router;