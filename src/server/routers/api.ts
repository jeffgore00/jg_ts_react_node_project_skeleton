import { Router } from 'express';
import healthCheck from '../middleware/health-check';
import addLog from '../middleware/logs';

const router = Router();

router.get('/health', healthCheck);
router.put('/logs', addLog);

export default router;
