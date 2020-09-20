import { Router, IRouter } from 'express';

import { createUser, deleteUser, getUser, updateUser } from '../controllers/userController';
import { validateCreateRequest, validateUpdateRequest, validateDeleteRequest } from '../middlewares/validation/user';
import { setCurrentUser } from '../middlewares/currentUser';

const router: IRouter = Router();

router.post('/', validateCreateRequest, createUser);

router.get('/', setCurrentUser, getUser);

router.put('/', setCurrentUser, validateUpdateRequest, updateUser);

router.delete('/', setCurrentUser, validateDeleteRequest, deleteUser);

export default router;