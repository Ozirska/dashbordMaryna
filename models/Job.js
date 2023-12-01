const mongoose = require("mongoose");
const { isEmail } = require("validator");

const jobSchema = new mongoose.Schema({
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
  },
  address: {
    data: String,
  },

  origin: {
    type: String,
    required: [true, "Please choose origin"],
  },
  status: {
    type: String,
    required: [true, "Please choose status"],
  },
  coments: {
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
