import { Router } from 'express';
import healthCheck from '../middleware/health-check';

const router = Router();

router.get('/health', healthCheck);

export default router;
