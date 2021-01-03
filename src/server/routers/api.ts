import { Router } from 'express';
import healthCheck from '../middleware/health-check';
import processLogFromClient from '../middleware/process-log-from-client';

const router = Router();

router.get('/health', healthCheck);
router.put('/logs', processLogFromClient);

export default router;
