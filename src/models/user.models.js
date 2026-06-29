const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please enter a valid email address",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            validate: {
                validator: function (value) {
                    return /^(?=.*\d)(?=.*[^A-Za-z0-9])[A-Z].{7,}$/.test(value);
                },
                message:
                    "Password must be at least 8 characters long, start with a capital letter, contain at least one number and one special character.",
            },
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    try {
        // Only hash if password is modified
        if (!this.isModified("password")) {
            return next;
        }

        this.password = await bcrypt.hash(this.password, 10);
        next;
    } catch (error) {
        next(error);
    }
});


module.exports = model("User", userSchema);