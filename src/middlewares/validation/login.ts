import { check } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import { validate } from '../../utils/validation';
import msg from '../../constants/messages'

const email = check('email')
                .isEmail()
                .withMessage(msg.INVALID_EMAIL);

const password = check('password')
                    .isString();

export async function validateLoginRequest(req: Request, res: Response, next: NextFunction){
    await validate(req, res, next, [
        email,
        password
    ]);
}