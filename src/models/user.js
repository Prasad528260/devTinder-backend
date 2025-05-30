const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      trim: true,
      maxLength: 25,
      validate(value) {
        if (!/^[A-Za-z\s]+$/.test(value)) {
          throw new Error(
            "About section must contain only letters and spaces."
          );
        }
      },
    },
    lastName: {
      type: String,
      required: true,
      validate(value) {
        if (!/^[A-Za-z\s]+$/.test(value)) {
          throw new Error(
            "About section must contain only letters and spaces."
          );
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error("Not A Strong Password " + val);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      validate(value) {
        if (!Number.isInteger(value)) {
          throw new Error("Age must be an integer.");
        }
        if (value < 18) {
          throw new Error("Age must be at least 18.");
        }
      },
    },

    gender: {
      type: String,
      validate(val) {
        if (!["male", "female", "other"].includes(val)) {
          throw new Error("Gender data is not valid .");
        }
      },
    },
    photUrl: {
      type: String,
      defaultValue:
        "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URl " + value);
        }
      },
    },
    about: {
      type: String,
      defaultValue: "This is default description of user",
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@TinderPrasad123", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const hashedPassword = user.password;
  const validate = await bcrypt.compare(password, hashedPassword);
  return validate;
};
module.exports = mongoose.model("User", userSchema);
