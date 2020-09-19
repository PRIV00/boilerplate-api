import { expect } from "chai";
import { Request, Response } from "express";

import User, { IUser } from "../../src/models/User";
import { getAuthToken } from '../../src/controllers/loginController';
import { mockExpressObjects } from "../helpers";

describe('Login Controller', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => ({ req, res } = mockExpressObjects()));
    
    describe('#getAuthToken()', () => {
        const username: string = 'test_user';
        const email: string = 'test@mail.com';
        const password: string = 'password';

        beforeEach(done => {
            const user: IUser = new User({
                username,
                email,
                password
            });
            user.save(done);
        });
        it('should return a signed token if email and password sent are valid.', done => {
            req.body = {
                email,
                password
            }
            getAuthToken(req, res)
                .then(result => {
                    expect(result).to.have.property('token');
                    done();
                })
                .catch(err => done(err));
        });
        it('should return an error message if email is not valid.', done => {
            req.body = {
                email: 'notregistered@gmail.com',
                password
            }
            getAuthToken(req, res)
                .then(result => {
                    expect(result).to.have.property('message').which.equals('Email or password incorrect');
                    expect(res.statusCode).to.equal(401);
                    done();
                })
                .catch(err => done(err));
        });
        it('should return an error message if password is not valid.', done => {
            req.body = {
                email,
                password: 'invalidpassword'
            }
            getAuthToken(req, res)
                .then(result => {
                    expect(result).to.have.property('message').which.equals('Email or password incorrect');
                    expect(res.statusCode).to.equal(401);
                    done();
                })
                .catch(err => done(err));
        });
    });
});