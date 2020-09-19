import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { mockExpressObjects } from '../helpers';
import User, { IUser } from '../../src/models/User';
import { setCurrentUser } from '../../src/middlewares/currentUser';

describe('Current User Middleware', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => ({ req, res, next } = mockExpressObjects()));

    describe('#setCurrentUser()', () => {
        let token: any;
        let user: IUser;

        beforeEach(done => {
            user = new User({
                username: 'test user',
                email: 'email@mail.com',
                password: 'password'
            });
            user.save()
                .then(() => {
                    token = jwt.sign(
                        { userId: user.id },
                        process.env.SECRET_KEY!
                    )
                    done();
                })
                .catch(err => done(err));
        });

        it('should return error response if auth header is missing.', done => {
            setCurrentUser(req, res, next)
                .then(result => {
                    expect(result).to.have.property('message').which.equals('Authorization header missing.');
                    done();
                })
                .catch(err => done(err));
        });
        it('should return unauthorized message if token is invalid.', done => {
            req.headers.authorization = "Bearer badtoken";
            setCurrentUser(req, res, next)
                .then(result => {
                    expect(result).to.have.property('message').which.equals('Login required.');
                    done();
                })
                .catch(err => done(err));
        });
        it('should set res.locals.user to the userId in the token if token is valid.', done => {
            req.headers.authorization = `Bearer ${token}`;
            setCurrentUser(req, res, next)
                .then(() => {
                    expect(res.locals).to.have.property('user').that.is.not.null;
                    done();
                })
                .catch(err => done(err));
        });
        it('should call next if token is valid.', done => {
            req.headers.authorization = `Bearer ${token}`;
            setCurrentUser(req, res, next)
                .then(() => {
                    expect((<any>next).calledOnce).to.be.true;
                    done();
                })
                .catch(err => done(err));
        });
    });
});