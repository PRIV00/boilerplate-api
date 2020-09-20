import { check } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

import User from '../../models/User';
import { validate } from '../../utils/validation';
import msg from '../../constants/messages';

// Base email requirements
const email = check('email')
                .isEmail()
                .withMessage(msg.INVALID_EMAIL)
                .custom(email => {
                    return User.findOne({ email })
                        .then(user => {
                            if (user) return Promise.reject('Email is in use.');
                        })
                });

// Base username requirements
const username = check('username')
                    .isLength({ min: 4, max: 20 })
                    .withMessage('Username must be between 4 and 20 characters.')
                    .custom(username => {
                        return User.findOne({ username })
                            .then(user => {
                                if (user) return Promise.reject('Username is in use.');
                            })
                    });

// Base password requirements
const password = check('password')
                    .isLength({ min: 6, max: 30 })
                    .withMessage('Password must be between 6 and 30 characters.');

// Base confirmPassword requirements
const confirmPassword = check('confirmPassword')
                            .custom((confirmPassword, { req }) => {
                                if (confirmPassword !== req.body.password) {
                                    throw new Error('confirmPassword does not match password.');
                                }
                                return true;
                            });

// Current password needed for updating user
const currentPassword = check('currentPassword').optional();
const newPassword = check('newPassword').optional();
const newEmail = check('newEmail').optional();

/**
 * Middleware for post request validation.
 */
export async function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
    await validate(req, res, next, [
        username,
        email,
        password,
        confirmPassword  
    ]);
}

export async function validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
    await validate(req, res, next, [
        newEmail,
        currentPassword,
        newPassword
    ]);
}

export async function validateDeleteRequest(req: Request, res: Response, next: NextFunction) {
    await validate(req, res, next, [
        password
    ]);
}
