const userModel = require("../models/userModel");
const validator = require("../validator/validator");
const jwt = require("jsonwebtoken");
const validatEmail = require("validator")
const aws = require("aws-sdk");
const bcrypt = require('bcrypt')



aws.config.update(
    {
      accessKeyId: "AKIAY3L35MCRVFM24Q7U",
      secretAccessKey: "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",
      region: "ap-south-1"
    }
  )
  
  
  let uploadFile = async (file) => {
    return new Promise(async function (resolve, reject) {
     // Promise.reject(reason) Returns a new Promise object that is rejected with the given reason.
     // Promise.resolve(value) Returns a new Promise object that is resolved with the given value.
      let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws
      
      var uploadParams = {
        ACL: "public-read",
        Bucket: "classroom-training-bucket", 
        Key: "radhika/" + file.originalname, 
        Body: file.buffer
      }
  
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          return reject({ "error": err })
        }
  
        console.log(data)
        console.log(" file uploaded succesfully ")
        return resolve(data.Location) // HERE
      })
      
    })
  }
  
  







const registerUser = async function (req, res) {
  try {
   // const requestBody = req.body;
    const requestBody = JSON.parse(req.body.data);
   // console.log(req.body.data)
    const address = JSON.parse(req.body.address)
   // console.log(requestBody)

    if (!validator.isValidBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "ERROR! : request body is empty" });
    } else {
      const { fname, lname, phone, email, password, confirmPassword } = requestBody;


      let isName = /^[A-Za-z ]*$/;

      if (!validator.isValid(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter name" });
      }
      if (!isName.test(fname)) {
        return res
          .status(422)
          .send({ status: false, message: "enter valid name" });
      }


      if (!validator.isValid(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter name" });
      }
      if (!isName.test(lname)) {
        return res
          .status(422)
          .send({ status: false, message: "enter valid name" });
      }


      if (!validator.isValid(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid phone" });
      }

      if (!/^[1-9]{1}\d{9}$/.test(phone)) {
        return res
          .status(422)
          .send({
            status: false,
            message:
              "please enter 10 digit number which does not contain 0 at starting position",
          });
      }


      const isPhoneAlreadyUsed = await userModel.findOne({
        phone,
        isDeleted: false,
      });

      if (isPhoneAlreadyUsed) {
        return res.status(409).send({
          status: false,
          message: `${phone} this phone number is already used so please put valid input`,
        });
      }

      if (!validator.isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "email is not present in input request" });
      }     
      if (!validatEmail.isEmail(email)) {
        return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })
      }

      if (!/^[^A-Z]*$/.test(email)) {
        return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })
      }


      const isEmailAlreadyUsed = await userModel.findOne({
        email,
        isDeleted: false,
      });

      if (isEmailAlreadyUsed) {
        return res.status(409).send({
          status: false,
          message: `${email} is already used so please put valid input`,
        });
      }

      if (!validator.isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid password" });
      }

      
      if (!validator.isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          msg: "Please enter Minimum eight characters password, at least one uppercase letter, one lowercase letter, one number and one special character"

        })
      }

      if (!validator.isValid(confirmPassword)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid confirmpassword" });
      }

      if (password !== confirmPassword) {
        return res
          .status(422)
          .send({
            status: false,
            message: "password does not match with confirm password",
          });
      }

      delete req.body["confirmPassword"];


      if (address == undefined || !validator.isValidBody(address)) {
        return res
          .status(400)
          .send({ status: false, message: "address is not present ,enter valid address" });
      }
      console.log(address)
      //const {shipping}= address;
     // const billing = address.billing

      if (!validator.isValid(address.shipping.street)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid shipping street address" });
      }

      if (!validator.isValid(address.shipping.pincode)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid shipping pincode" });
      }

      if (!/^[1-9]{1}[0-9]{5}$/.test(address.shipping.pincode)) {
        return res
          .status(422)
          .send({
            status: false,
            message: `${address.shipping.pincode}enter valid shipping picode of 6 digit and which do not start with 0`,
          });
      }

      if (!validator.isValid(address.shipping.city)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid shipping city name " });
      }
    }

    

    if (!validator.isValid(address.billing.street)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid billing street address" });
      }

      if (!validator.isValid(address.billing.pincode)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid billing pincode" });
      }

      if (!/^[1-9]{1}[0-9]{5}$/.test(address.billing.pincode)) {
        return res
          .status(422)
          .send({
            status: false,
            message: `${address.billing.pincode}enter valid billing picode of 6 digit and which do not start with 0`,
          });
      }

      if (!validator.isValid(address.billing.city)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid billing city name " });
      }

    let uploadedFileURL;

    let files = req.files // file is the array
    if (files && files.length > 0) {

      uploadedFileURL = await uploadFile(files[0])

    }
    else {
      return res.status(400).send({ msg: "No file found in request" })
    }
    requestBody.profileImage = uploadedFileURL;

    const user = new userModel(requestBody)
    
    const userData = await user.save(requestBody);
    return res.status(201).send({
      status: true,
      message: "successfully saved user data",
      data: userData,
    });

  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};




const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "enter valid email" });
    }

    if (!validatEmail.isEmail(email)) {
      return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })

    }

    if (!/^[^A-Z]*$/.test(email)) {

      return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })

    }







    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "enter valid password" });
    }

    let user = await userModel.findOne({ email: email, password: password });
    
    if (!user)
      return res.status(404).send({
        status: false,
        msg: "email or the password is not corerct or user with this email is not present",
      });
     
    let token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        iat: new Date().getTime() / 1000
      },
      "PROJECT3BOOKMANAGEMENTPROJECTDONYBYGROUP7",
      {
        expiresIn: "90m",
      }
    );
    const userLogin = {
        userId: user._id,
        token:token
    }

    res.setHeader("x-auth-token", token);
    return res.status(200).send({ status: true,message:"User login successfull", data: userLogin });

  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};




const updateUser = async (req,res) => {

    const requestBody = req.body
    if(!validator.isValidBody(requestBody)) requestBody = JSON.parse(req.body.data)

    if(!validator.isValidBody(requestBody)){
        return res
        .status(400)
        .send({ status: false, message: "ERROR! : request body is empty" });
    }
    
    const { fname, lname, phone, email, password} = requestBody;
    const address = JSON.parse(req.body.address)

    if(fname){
        let isName = /^[A-Za-z ]*$/;

      if (!validator.isValid(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter name" });
      }
      if (!isName.test(fname)) {
        return res
          .status(422)
          .send({ status: false, message: "enter valid name" });
      }

    }

    if(lname){
        
      if (!validator.isValid(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter name" });
      }
      if (!isName.test(lname)) {
        return res
          .status(422)
          .send({ status: false, message: "enter valid name" });
      }
    }

    if(phone){
        if (!validator.isValid(phone)) {
            return res
              .status(400)
              .send({ status: false, message: "enter valid phone" });
          }
    
        if (!/^[1-9]{1}\d{9}$/.test(phone)) {
            return res
              .status(422)
              .send({
                status: false,
                message:
                  "please enter 10 digit number which does not contain 0 at starting position",
              });
          }
    
    
          const isPhoneAlreadyUsed = await userModel.findOne({
            phone,
            isDeleted: false,
          });
    
          if (isPhoneAlreadyUsed) {
            return res.status(409).send({
              status: false,
              message: `${phone} this phone number is already used so please put valid input`,
            });
          }
    
    }

    if(email){
        
      if (!validator.isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "email is not present in input request" });
      }     
      if (!validatEmail.isEmail(email)) {
        return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })
      }

      if (!/^[^A-Z]*$/.test(email)) {
        return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })
      }


      const isEmailAlreadyUsed = await userModel.findOne({
        email,
        isDeleted: false,
      });

      if (isEmailAlreadyUsed) {
        return res.status(409).send({
          status: false,
          message: `${email} is already used so please put valid input`,
        });
      }

    }


    if(password){
        if (!validator.isValid(password)) {
            return res
              .status(400)
              .send({ status: false, message: "enter valid password" });
          }
    
          
          if (!validator.isValidPassword(password)) {
            return res.status(400).send({
              status: false,
              msg: "Please enter Minimum eight characters password, at least one uppercase letter, one lowercase letter, one number and one special character"
    
            })
          }

          const salt = await bcrypt.genSalt(10) // idealy minimum 8 rounds required here we use 10 rounds
          const hashPassword = await bcrypt.hash(password,salt)
          requestBody.password = hashPassword
 }










}











module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
