import { Router, RequestHandler } from 'express';

const router = Router();

const rootApiGetResponder: RequestHandler = (req, res, next) => {
  try {
    res.status(200).send('You have reached the /api route. Good for you.');
  } catch (err) {
    next(err);
  }
};

router.get('/', rootApiGetResponder);

export default router;
