const handleUserErrors = (err) => {
  console.log(err.message, err.code);

  let errors = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gitHub: "",
    profilePicture: "",
    pdfFile: "",
  };
  //incorrect firstName
  if (err.message === "incorrect firstName") {
    errors.firstName = "firstName is requared";
  }
  //incorrect lastName
  if (err.message === "incorrect lastName") {
    errors.lastName = "lastName is requared";
  }
  //incorrect gitHub
  if (err.message === "incorrect gitHub") {
    errors.gitHub = "incorrect gitHub link";
  }
  //incorrect profilePicture
  if (err.message === "incorrect profilePicture") {
    errors.profilePicture = "profile picture is requared";
  }
  //incorrect pdfFile
  if (err.message === "incorrect pdfFile") {
    errors.pdfFile = "CV is requared";
  }
  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  //incorrect confirmPassword
  if (err.message === "incorrect confirmPassword") {
    errors.confirmPassword = "that password not match";
  }
  // duplicate code

  if (err.code === 11000) {
    errors.email = "that email is alredy registered";
    return errors;
  }

  //validation err

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      //   console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
//////////////////////////////////
///////////////////////////////////
////////////////////////////////////

const handleJobErrors = (err) => {
  console.log(Object.values(err.errors));
  let errors = {
    jobTitle: "",
    website: "",
    employerName: "",
    email: "",
    phone: "",
    address: "",
    origin: "",
    status: "",
  };

  if (err.message === "incorrect jobTitle") {
    errors.jobTitle = "jobTitle is requared";
  }

  if (err.message === "incorrect website") {
    errors.website = "website is requared";
  }

  if (err.message === "incorrect employerName") {
    errors.employerName = "Name is requared";
  }

  if (err.message === "incorrect email") {
    errors.email = "email is requared";
  }

  if (err.message === "incorrect phone") {
    errors.phone = "phone is requared";
  }

  if (err.message === "incorrect address") {
    errors.address = "address is requared";
  }

  if (err.message === "incorrect origin") {
    errors.origin = "Choose origin";
  }
  if (err.message === "incorrect status") {
    errors.status = "Choose status";
  }

  //  //validation err

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      //   console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  // Check if the error is a Mongoose validation error
  if (err.name === "ValidationError") {
    Object.keys(err.errors).forEach((fieldName) => {
      errors[fieldName] = err.errors[fieldName].message;
    });
  }
  return errors;
};

module.exports = { handleUserErrors, handleJobErrors };
