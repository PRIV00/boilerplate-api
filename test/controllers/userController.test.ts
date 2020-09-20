import { expect } from "chai";
import { Request, Response } from "express";

import { createUser, updateUser, getUser, deleteUser } from "../../src/controllers/userController";
import User, { IUser } from "../../src/models/User";
import { mockExpressObjects } from "../helpers";
import msg from '../../src/constants/messages';



describe('User Controller', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => ({ req, res } = mockExpressObjects()));

    describe('#createUser()', () => {
        beforeEach(() => {
            req.body = {
                username: 'Test User',
                email: 'test_email@gmail.com',
                password: 'password'
            }
        })
        it('should save the user to the database.', done => {
            createUser(req, res)
                .then(result => {
                    return User.findById((<any>result)._id);
                })
                .then(result => {
                    expect(result).to.not.be.null;
                    done();
                })
                .catch(err => done(err));
        });
        it('should return the user data as a json.', done => {
            createUser(req, res)
                .then(result => {
                    expect(['_id', 'username', 'email']).to.have.members(Object.keys(result));
                    expect(result).to.have.property('username').which.equals(req.body.username);
                    expect(result).to.have.property('email').which.equals(req.body.email);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('#deleteUser()', () => {
        beforeEach(done => {
            res.locals.user = new User({
                username: 'Test User',
                email: 'test@test.com',
                password: 'password'
            })
            res.locals.user.save()
                .then(() => {
                    return User.findById(res.locals.user._id);
                })
                .then((result: IUser | null) => {
                    expect(result).to.not.be.null;
                    done();
                });
            req.body.password = 'password';
        })
        it('should delete the current user if correct password is provided.', done => {
            deleteUser(req, res)
                .then(() => {
                    return User.findById(res.locals.user._id);
                })
                .then((result: IUser | null) => {
                    expect(result).to.be.null;
                    done();
                })
                .catch(err => done(err));
        });

        it('should give a user deleted message if delete was successful.', done => {
            deleteUser(req, res)
                .then(result => {
                    expect(result).to.have.property('message').which.equals(msg.USER_DELETED);
                    done();
                })
                .catch(err => done(err));
        });
        
        it('should not delete the current user if incorrect password is provided.', done => {
            req.body.password = 'badpassword';
            deleteUser(req, res)
                .then(() => {
                    return User.findById(res.locals.user._id);
                })
                .then((result: IUser | null) => {
                    expect(result).to.not.be.null;
                    done();
                })
                .catch(err => done(err));
        });

        it('should return an incorrect password message if incorrect password is provided.', done => {
            req.body.password = 'badpassword';
            deleteUser(req, res)
                .then(result => {
                    expect(result).to.have.property('message').which.equals(msg.INVALID_PASSWORD);
                    done();
                })
                .catch(err => done(err));
        })
    });

    describe('#getUser()', () => {
        beforeEach(() => {
            res.locals.user = new User({
                username: 'Test User',
                email: 'test@test.com',
                password: 'testpassword'
            });
        });

        it('should get the current user\'s data', done => {
            getUser(req, res)
                .then(result => {
                    expect(result).to.have.property('username').which.equals(res.locals.user.username);
                    expect(result).to.have.property('email').which.equals(res.locals.user.email);
                    expect(result).to.have.property('_id');
                    expect(result).to.not.have.property('password');
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('#updateUser()', () => {
        beforeEach(done => {
            res.locals.user = new User({
                username: 'Test User',
                email: 'test@test.com',
                password: 'password'
            });
            res.locals.user.save(done);
        });
        it('should reject the update request if currentPassword is incorrect.', done => {
            req.body.currentPassword = 'badPassword';
            updateUser(req, res)
                .then(result => {
                    expect(result).to.have.property('message').which.equals(msg.INVALID_PASSWORD);
                    expect(res.statusCode).to.equal(401);
                    done();
                })
                .catch(err => done(err));
        });
        it('should update the user\'s email if provided.', done => {
            req.body.currentPassword = 'password';
            req.body.newEmail = 'test2@test.com' 
            updateUser(req, res)
                .then(result => {
                    expect(result).to.have.property('email').which.equals(req.body.newEmail);
                    done();
                })
                .catch(err => done(err));
        });
        it('should update the user\'s password if provided.', done => {
            req.body.currentPassword = 'password';
            req.body.newPassword = 'newPassword';
            updateUser(req, res)
                .then(() => {
                    return User.findById(res.locals.user._id).select('+password');
                })
                .then(result => {
                    return (<IUser>result).validatePassword('newPassword');
                })
                .then(result => {
                    expect(result).to.be.true;
                    done();
                })
                .catch(err => done(err));
        });
    })
});