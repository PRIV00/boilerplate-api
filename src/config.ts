import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

export default {
    KEY: process.env.SECRET_KEY!
}

/**
 * Opens the connection to the MongoDB database.
 * 
 * @param silent Will log connection statuses if false.
 */
export async function openDatabaseConnection(silent = false) {
    if (!silent) {
        console.log(`Connecting to db: ${process.env.NODE_ENV}`);
        mongoose.connection.on('connected', () => {
            console.log('Connected to DB established.');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Connection to DB lost.');
        });
        mongoose.connection.on('open', () => {
            console.log('Connection to DB open.');
        });
        mongoose.connection.on('close', () => {
            console.log('Connected to DB closed.');
        });
        mongoose.connection.on('error', error => {
            console.log('ERROR: ' + error);
        });
    }

    let uri;
    if (process.env.NODE_ENV === 'test') {
        uri = process.env.TEST_DB_URI!;
    }
    else {
        uri = process.env.DB_URI!;
    }

    try {
        return await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
    } catch (error) {
        console.log('ERROR: ' + error);
    }
}