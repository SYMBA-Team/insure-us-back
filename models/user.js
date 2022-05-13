import mongoose from "mongoose";
import bcrypt from "bcrypt";

function validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            validate: [validateEmail, "Please fill a valid email address"],
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, discriminatorKey: "__type" }
);

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.Optimize = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
userSchema.methods.comparePasswords = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        return false;
    }
};

const User = mongoose.model("User", userSchema);
export default User;
export const Admin = User.discriminator(
    "Admin",
    {
        valid: { type: Boolean, default: false },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    { discriminatorKey: "__type" }
);
export const Client = User.discriminator(
    "Client",
    { syncId: { type: String } },
    { discriminatorKey: "__type" }
);
