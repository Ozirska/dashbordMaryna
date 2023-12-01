const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  gitHub: {
    type: String,
    validate: {
      validator: function (value) {
        // Using a regular expression to check if it's a valid GitHub link
        const githubLinkRegex =
          /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
        return githubLinkRegex.test(value);
      },
      message: "Please enter a valid GitHub link",
    },
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  pdfFile: {
    data: Buffer,
    contentType: String,
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  confirmPassword: {
    type: String,
    required: [false, "Please confirm the password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

// fire a function after do saved to db
userSchema.post("save", function (doc, next) {
  console.log("new user was created and saved", doc);
  next();
});

//fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt();

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Set the hashed password to the password field
    this.password = hashedPassword;

    // Continue with the save operation
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
