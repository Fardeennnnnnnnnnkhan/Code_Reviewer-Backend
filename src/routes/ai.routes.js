import  express from  'express';
import aiController  from  '../Controller/ai.controller.js';
const router = express.Router();

router.post('/get-review', aiController.getReview);
router.get('/get-history', aiController.getHistory);

export default router