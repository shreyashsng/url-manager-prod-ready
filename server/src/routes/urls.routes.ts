import {Router} from 'express';
import { createUrl, getAnalytics, getOriginalUrl, getStats, getUserUrls } from '../controllers/url.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createUrl);
router.get('/stats/:shortCode', authenticate, getStats);
router.get('/analytics/:shortCode', authenticate, getAnalytics);
router.get('/my-urls', authenticate, getUserUrls);
router.get('/:shortCode', getOriginalUrl);

export default router;