import express from 'express';
import { getUserProgress, getUserActivity, getUserStreak } from '../Controller/dashboard.controller.js';

const router = express.Router();

router.get('/user-progress/:userId', getUserProgress);
router.get('/activity/:userId', getUserActivity);
router.get('/streak/:userId', getUserStreak);

export default router;
