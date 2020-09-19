import { Router, RequestHandler } from 'express';

const router = Router();

const rootApiGetResponder: RequestHandler = (req, res) => {
  res.status(200).send('You have reached the /api route. Good for you.');
};

router.get('/', rootApiGetResponder);

export default router;
