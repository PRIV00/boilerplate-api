import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../src/app';
import User, { IUser } from '../../src/models/User';


describe('Login routes', () => {
    describe('POST /login', () => {
        it('should return request validation errors if request body does not match proper schema.', done => {
            request(app)
                .post('/login')
                .send({
                    badField: 'nope',
                    otherfield: 'nonono'
                })
                .expect('Content-type', /json/)
                .then(response => {
                    expect(response.body).to.have.property('errors');
                    done();
                })
                .catch(err => done(err));
        });
        it('should return a 401 error message if user does not exists.', done => {
            request(app)
                .post('/login')
                .send({
                    email: 'test@mail.com',
                    password: 'test'
                })
                .expect('Content-type', /json/)
                .expect(401, done);
        });
        it('should return a 200 response with a token if login is successful', done => {
            const user: IUser = new User({
                username: 'test',
                email: 'test@test.com',
                password: 'password'
            });
            user.save()
                .then(() => {
                    request(app)
                        .post('/login')
                        .send({
                            email: 'test@test.com',
                            password: 'password'
                        })
                        .expect('Content-type', /json/)
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.have.property('token')
                            done();
                        })
                })
                .catch(err => done(err));
        });
    });
});