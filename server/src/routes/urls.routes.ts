import {Router} from 'express';
import { createUrl, getAnalytics, getOriginalUrl, getStats } from '../controllers/url.controller';

const router = Router();

router.post('/', createUrl);
router.get('/:shortCode', getOriginalUrl);
router.get('/stats/:shortCode', getStats);
router.get('/analytics/:shortCode', getAnalytics);

export default router;