import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';


/**
 * Base user interface. Add onto this as needed. Fields should match the schema below.
 */
export interface IUser extends Document {
    username: string,
    email: string,
    password?: string,
    validatePassword(password: string): Promise<boolean>
}

/**
 * Schema for the user model. Add onto this schema as needed.
 */
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 4, 
        maxlength: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true,
        minlength: 4,
        maxlength: 100
    },
    __v: {
        type: Number,
        select: false
    }
});

/**
 * Mongoose pre-save middleware to hash the password if it is created or updated.
 */
userSchema.pre<IUser>('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS!);
            this.password = await bcrypt.hash(this.password!, salt);
            return next();
        } catch (err) {
            return next(err);
        }
    }
});



/**
 * Validates the user's password against the hashed password.
 * 
 * @param password The password to be validated.
 */
userSchema.methods.validatePassword = async function validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model<IUser>('User', userSchema);
