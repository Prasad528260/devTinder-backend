const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter valid name");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email id not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
};

const validateProfileEditData = (req) => {
  const ALLOWED_EDIT = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photUrl",
    "skills",
    "about",
  ];

  const isEditAllowed=Object.keys(req.body).every((k)=>
    ALLOWED_EDIT.includes(k)
  )
  return isEditAllowed;
};

module.exports = {
  signUpValidation,
  validateProfileEditData
};
