import { Router } from 'express';
import healthCheck from '../middleware/health-check';
import processLogFromClient from '../middleware/process-log-from-client';

import { corsStrictSameOrigin } from '../utils/cors';

const router = Router();

router.get('/health', healthCheck);
router.put('/logs', corsStrictSameOrigin, processLogFromClient);

export default router;
