const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { handleUserErrors } = require("../controllers/errorController");

// Token configuration
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "dashboard secret", {
    expiresIn: maxAge,
  });
};

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dbsq5nssw",
  api_key: "884367867213978",
  api_secret: "99TvMizYKa3yklt35KHbEJ1U18w",
});

// Validation function
function validateUserData(req) {
  const errors = {};

  if (!req.files || Object.keys(req.files).length === 0) {
    errors.profilePicture = "Incorrect profile picture";
    errors.pdfFile = "Incorrect pdfFile";
  }

  if (!req.files.profilePicture || req.files.profilePicture.length === 0) {
    errors.profilePicture = "Incorrect profile picture";
  }

  if (!req.files.pdfFile || req.files.pdfFile.length === 0) {
    errors.pdfFile = "Incorrect pdfFile";
  }

  // Check for required fields
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "gitHub",
    "confirmPassword",
  ];

  const fildErr = {
    firstName: "First name is requared",
    lastName: "Last name is requared",
    email: "Email is requared",
    password: "Password is requared",
    gitHub: "GitHub link is requared",
    confirmPassword: "Please, confirm password",
  };

  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      errors[field] = fildErr[field];
    }
  });

  // Check Mongoose validation errors
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gitHub: req.body.gitHub,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    profilePicture: "dummy", // Just a placeholder, since these fields are validated separately
    pdfFile: "dummy",
  });

  // Create a new instance for synchronous validation
  const validationInstance = new User();
  validationInstance.set(newUser.toObject()); // Copy values to the validation instance

  validationInstance.validateSync(); // Trigger synchronous validation

  const mongooseErrors = validationInstance.errors.message || {}; // Get Mongoose validation errors

  // Merge the errors
  console.log("ERRORS IN VALIDATOR");
  console.log(mongooseErrors);

  // Continue with the subsequent code using the `errors` object
  // ...

  return { ...errors, ...mongooseErrors }; // You can still return the errors if needed
}

// Handle file upload
async function handleFileUpload(req, res) {
  const validationErrors = validateUserData(req);
  if (Object.keys(validationErrors).length > 0) {
    // Return the validation errors
    return res.status(400).json({ errors: validationErrors });
  }
  try {
    const profilePictureBuffer = req.files.profilePicture[0].buffer;
    const pdfFileBuffer = req.files.pdfFile[0].buffer;

    const profilePictureStream =
      streamifier.createReadStream(profilePictureBuffer);
    const pdfFileStream = streamifier.createReadStream(pdfFileBuffer);

    const profilePictureResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      profilePictureStream.pipe(uploadStream);
    });

    const pdfFileResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      pdfFileStream.pipe(uploadStream);
    });

    // Save user details with Cloudinary URLs to MongoDB
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gitHub: req.body.gitHub,
      email: req.body.email,
      password: req.body.password,
      profilePicture: profilePictureResult.secure_url,
      pdfFile: pdfFileResult.secure_url,
    });

    await newUser.save();

    // Create a token and set a cookie
    const token = createToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // Send success response
    res.json({ success: true });
  } catch (error) {
    // console.error(error);

    const errors = handleUserErrors(error);
    res.status(400).json({ errors });

    // Log the specific error message
    if (error.message) {
      console.error("Error Message:", error.message);
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

module.exports = { handleFileUpload };
