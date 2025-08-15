import { Router } from 'express';
import Filter from './ResearchRoutes';

const router = Router();

router.route('/').get((_, res) => {
  res.status(200).send('Made by Group 5');
});

router.use('/filters', Filter);

export default router;
