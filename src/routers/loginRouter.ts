import { IRouter, Router } from 'express';

import { getAuthToken } from '../controllers/loginController';
import { validateLoginRequest }from '../middlewares/validation/login';

const router: IRouter = Router();

router.post('/', validateLoginRequest, getAuthToken);

export default router;