import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import User, { IUser } from '../models/User';

interface IAuthToken {
    userId: string
    iat: number
}


/**
 * Middleware that validates the provided json web token.
 * 
 * If a valid token is provided in the request header, res.locals.user is set
 * to the current user.
 * 
 * If the token does not validate, an error message is returned in the response.
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Next middleware function
 */
export async function setCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ message: 'Authorization header missing.' });
        }
        const auth: string = req.headers.authorization!.split(" ")[1];
        const payload: IAuthToken = <IAuthToken>jwt.verify(auth, process.env.SECRET_KEY!);
        const user: IUser | null = await User.findById(payload.userId);
        if (!user) {
            return res.status(404).json({ message: 'Authorization succeeded, but user was not found.' });
        }
        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Login required.' });
    }
}