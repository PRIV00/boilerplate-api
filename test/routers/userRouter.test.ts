import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../src/app';
import User, { IUser } from '../../src/models/User';
import config from '../../src/config';

describe('User Routes', () => {
    describe('POST /profile', () => {
        it('should create a new user and return response with user data if valid request is passed', done => {
            let userData = {
                username:'TestUser',
                email: 'mail@mail.com',
                password: 'password',
                confirmPassword: 'password'
            }
            request(app)
                .post('/profile')
                .send(userData)
                .expect(201)
                .expect('Content-type', /json/)
                .then(response => {
                    expect(response.body).to.have.property('username').which.equals(userData.username);
                    expect(response.body).to.have.property('email').which.equals(userData.email);
                    return User.findOne({ username: userData.username })
                })
                .then((user: IUser | null) => {
                    expect(user).to.not.be.null;
                    done();
                })
                .catch(err => done(err));
        });

        it('should return an error response message if request body is not valid.', done => {
            let userData = {
                username:'TestUser',
                email: 'mail@mail.com',
                password: 'password',
                // Missing confirmPassword
            }
            request(app)
                .post('/profile')
                .send(userData)
                .expect('Content-type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.have.property('errors');
                    expect(response.body.errors[0].param).to.equal('confirmPassword');
                    done();
                })
                .catch(err => done(err));
        });

        it('should return and error message if username is in use.', done => {
            let userData: any = {
                username:'TestUser',
                email: 'mail@mail.com',
                password: 'password',
            }
            const user: IUser = new User(userData);
            user.save()
                .then(() => {
                    userData.email = 'new_email@mail.com'
                    userData.confirmPassword = 'password'
                    request(app)
                        .post('/profile')
                        .send(userData)
                        .expect('Content-type', /json/)
                        .expect(400)
                        .then(response => {
                            expect(response.body).to.have.property('errors');
                            expect(response.body.errors.length).to.equal(1);
                            expect(response.body.errors[0].param).to.equal('username');
                            done();
                        })
                        .catch(err => done(err));
                });
        });
        it('should return and error message if email is in use.', done => {
            let userData: any = {
                username:'TestUser',
                email: 'mail@mail.com',
                password: 'password',
            }
            const user: IUser = new User(userData);
            user.save()
                .then(() => {
                    userData.username = 'NewUser'
                    userData.confirmPassword = 'password'
                    request(app)
                        .post('/profile')
                        .send(userData)
                        .expect('Content-type', /json/)
                        .expect(400)
                        .then(response => {
                            expect(response.body).to.have.property('errors');
                            expect(response.body.errors.length).to.equal(1);
                            expect(response.body.errors[0].param).to.equal('email');
                            done();
                        })
                        .catch(err => done(err));
                });
        });
        it('should return an error message if passwords do not match.', done => {
            let userData: any = {
                username:'TestUser',
                email: 'mail@mail.com',
                password: 'password',
            }
            userData.confirmPassword = 'badpassword'
            request(app)
                .post('/profile')
                .send(userData)
                .expect('Content-type', /json/)
                .expect(400)
                .then(response => {
                    expect(response.body).to.have.property('errors');
                    expect(response.body.errors.length).to.equal(1);
                    expect(response.body.errors[0].param).to.equal('confirmPassword');
                    done();
                })
                .catch(err => done(err));
        });
    });
    describe('GET /profile', () => {
        let user: IUser;
        let authToken: any;

        beforeEach(done => {
            user = new User({
                username: 'Test',
                email: 'mail@mail.com',
                password: 'password'
            });
            authToken = jwt.sign({ userId: user.id }, config.KEY);
            user.save(done);
        });

        it('should return an error message if authorization token is invalid.', done => {
            request(app)
                .get('/profile')
                .set('Authorization', `Bearer notagoodtoken`)
                .expect(401, {
                    message: 'Login required.'
                }, done);
        });

        it('should return an error message if auth header is missing', done => {
            request(app)
                .get('/profile')
                .expect(400, {
                    message: 'Authorization header missing.'
                }, done);
        })

        it('should return the current user\'s username and email.', done => {
            request(app)
                .get('/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, {
                    _id: user.id,
                    username: user.username,
                    email: user.email
                }, done);
        });
    });
    describe('PUT /profile', () => {
        it('should return an error message if authorization token is invalid.');
        it('should update the user\'s email if provided and current paasword matches.');
        it('should update the user\'s password if provided and password conf matches and current password matches.');
        it('should return an error message response if current password is invalid.');
    });
});
