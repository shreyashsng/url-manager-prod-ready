import {Router} from 'express';
import { createUrl, getAnalytics, getOriginalUrl, getStats } from '../controllers/url.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createUrl);
router.get('/:shortCode', getOriginalUrl);
router.get('/stats/:shortCode', authenticate, getStats);
router.get('/analytics/:shortCode', authenticate, getAnalytics);

export default router;