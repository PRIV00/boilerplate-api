import { openDatabaseConnection } from '../src/config';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sinon from 'sinon';

import User from '../src/models/User';

dotenv.config()

// Connect to the test db before any tests run.
before(done => {
    openDatabaseConnection()
        .then(() => {
            done();
        })
        .catch(err => done(err));
    // Add any additional need setup code here.
});


// Disconnect from the test db after all tests have run.
after(done => {
    mongoose.disconnect()
            .then(() => done())
            .catch(err => done(err));
    // Add any additional needed cleanup code here.
});

// Test Case cleanup. Restore sinon stubs/fakes and clear out the test database.
afterEach(done => {
    sinon.restore();
    User.deleteMany({})
        .then(() => {
            done();
        })
        .catch(err => done(err));
    // Add any additional needed cleanup code here.
});

