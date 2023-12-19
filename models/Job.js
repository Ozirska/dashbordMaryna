const mongoose = require("mongoose");
const { isEmail } = require("validator");

const jobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: [true, "Please enter job title"],
  },
  website: {
    type: String,
    required: [true, "Please enter website"],
  },
  employerName: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please enter phone"],
  },
  address: {
    type: String,
    required: [true, "Please enter address"],
  },

  origin: {
    type: String,
    required: [true, "Please choose origin"],
  },
  status: {
    type: String,
    required: [true, "Please choose status"],
  },
  comments: {
    type: String,
  },
});

// fire a function after do saved to db
jobSchema.post("save", function (doc, next) {
  console.log("new job was created and saved", doc);
  next();
});

const Job = mongoose.model("job", jobSchema);

module.exports = Job;
