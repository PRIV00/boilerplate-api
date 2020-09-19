import { Router, IRouter } from 'express';

import { createUser, getUser, updateUser } from '../controllers/userController';
import { validateCreateRequest, validateUpdateRequest } from '../middlewares/validation/user';
import { setCurrentUser } from '../middlewares/currentUser';

const router: IRouter = Router();

router.post('/', validateCreateRequest, createUser);

router.get('/', setCurrentUser, getUser);

router.put('/', setCurrentUser, validateUpdateRequest, updateUser);

export default router;