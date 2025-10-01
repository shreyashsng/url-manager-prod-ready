import {Router} from 'express';
import { createUrl, deleteUrl, getAnalytics, getOriginalUrl, getStats, getUserUrls } from '../controllers/url.controller';
import { authenticate } from '../middleware/auth';
import { createUrlLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', authenticate, createUrlLimiter, createUrl);
router.get('/stats/:shortCode', authenticate, getStats);
router.get('/analytics/:shortCode', authenticate, getAnalytics);
router.get('/my-urls', authenticate, getUserUrls);
router.get('/:shortCode', getOriginalUrl);
router.delete('/:shortCode', authenticate, deleteUrl);

export default router;