import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/User';
import config from '../config';
import msg from '../constants/messages';

/**
 * Takes the email and password provided in the body of the request and 
 * returns a json web token containing the user's id in the response.
 */
export async function getAuthToken(req: Request, res: Response) {
    try {
        let { email, password } = req.body;
        const user: IUser | null = await User.findOne({ email }).select('+password');
        if (!user || !await user.validatePassword(password)) {
            return res.status(401).json({ message: msg.INVALID_EMAIL_OR_PASS })
        }
        const token = jwt.sign(
            { userId: user.id },
            config.KEY
        )
        return res.json({ token });
    } catch(err) {
        throw err;
    }
}