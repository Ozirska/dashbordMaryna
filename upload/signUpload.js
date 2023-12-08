const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

///////token

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "dashboard secret", {
    expiresIn: maxAge,
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
async function handleFileUpload(req, res) {
  const profilePictureBuffer = req.files.profilePicture[0].buffer;
  const pdfFileBuffer = req.files.pdfFile[0].buffer;

  const profilePictureStream =
    streamifier.createReadStream(profilePictureBuffer);
  const pdfFileStream = streamifier.createReadStream(pdfFileBuffer);

  try {
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
    console.error(error);

    // Log the specific error message
    if (error.message) {
      console.error("Error Message:", error.message);
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

module.exports = { handleFileUpload };
