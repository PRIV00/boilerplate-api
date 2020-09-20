import express, { Request, Response } from 'express';

import User, { IUser } from '../models/User';
import msg from '../constants/messages';

/**
 * Endpoint for creating a new user. Assumes that request body validation
 * has been completed in previous middleware.
 */
export async function createUser(req: Request, res: Response) {
    try {
        let user: IUser = new User(req.body);
        await user.save();
        user = user.toObject();
        delete user.password;
        delete user.__v;
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}


/**
 * Deletes the current user's profile. Current password must be validated
 * before the delete is confirmed. res.locals.user is set by preceding middleware.
 */
export async function deleteUser(req: Request, res: Response) {
    try {
        if (!await res.locals.user.validatePassword(req.body.password)) {
            return res.status(401).json({ message: msg.INVALID_PASSWORD });
        }
        await User.findByIdAndDelete(res.locals.user._id);
        return res.status(200).json({ message: msg.USER_DELETED });
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * Returns the current user's data. res.locals.user is set by preceding middleware.
 */
export async function getUser(req: Request, res: Response) {
    try {
        let user = res.locals.user.toObject();
        delete user.password;
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * Updates the current user's data. Current password must be provided to make changes.
 * res.locals.user is set by preceding middleware.
 */
export async function updateUser(req: Request, res: Response) {
    try {
        let user: IUser = res.locals.user;
        if (!await user.validatePassword(req.body.currentPassword)) {
            return res.status(401).json({ message: msg.INVALID_PASSWORD });
        }
        if (req.body.newEmail) {
            user.email = req.body.newEmail;
        }
        if (req.body.newPassword) {
            user.password = req.body.newPassword;
        }
        await user.save();
        user = user.toObject();
        delete user.password;
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}
