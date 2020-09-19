import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Helper function to be called by middleware for validation middleware to check for any errors
 * and send them back to the user if they are present.
 * 
 * @param req The current express request to validate
 * @param res The current express response
 * @param next The next middleware function.
 * @param validations The array of validations to check
 */
export async function validate(req: Request, res: Response, next: NextFunction, validations: Array<ValidationChain>) {
    await Promise.all(validations.map(validation => validation.run(req)));    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
