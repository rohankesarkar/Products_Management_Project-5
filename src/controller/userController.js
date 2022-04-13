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
    const requestBody = req.body;
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
    requestBody.address = address

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

    let user = await userModel.findOne({ email: email});
    let isValidPassword
    if (user) {
        // this line will return Boolean result
         isValidPassword = await bcrypt.compare(req.body.password, user.password)
         
    }

    console.log(isValidPassword)
    
    if (!isValidPassword)
      return res.status(404).send({
        status: false,
        msg: "email or the password is not correct or user with this email is not present",
      });

    
     
    let token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        iat: new Date().getTime() / 1000
      },
      "PROJECT3BOOKMANAGEMENTPROJECTDONYBYGROUP7",
      {
        expiresIn: "2m",
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




const getUser = async function (req, res) {
    try {
        const userId = req.params.userId
        const body = req.body

        if (!(validator.isValidobjectId(userId) && validator.isValid(userId))) {
            return res.status(400).send({ status: false, msg: "userId is not valid" })
        }
        if (validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "body should be empty" })
        }

        const userData = await userModel.findById({ _id: userId })
        if (userData) {
            return res.status(200).send({ status: true, msg: "user profile details", data: userData })
        } else {
            return res.status(404).send({ status: false, msg: "userid does not exist" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.getUser = getUser













const updateUser = async function(req,res){
    try{
    const userId = req.params.userId
    let address = req.body.address
       // console.log(req.body.address)
    // if(!validator.isValid(address)){
    //     return res.status(400).send({status:false, message:"invalid address or address is not present"})
    // }







    let requestBody =req.body

   // const requestBody = req.body
    

    if(!validator.isValidBody(requestBody)){
        return res
        .status(400)
        .send({ status: false, message: "ERROR! : request body is empty" });
    }
    
    let { fname, lname, phone, email, password} = requestBody;
    

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
        let isName = /^[A-Za-z ]*$/;
        
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


        
    let uploadedFileURL;

    let files = req.files // file is the array

    if (files && files.length > 0) {

      uploadedFileURL = await uploadFile(files[0])

      if(uploadedFileURL){
          req.body.profileImage = uploadedFileURL
      } else{
          return res.status(400).send({status:false, message:"error uploadedFileURL is not present"})
      }

    }


   // address =JSON.parse(JSON.stringify(req.body.address))

    // console.log(address, typeof address)
    // if(!(typeof address == Object)){
      //   address = JSON.parse(req.body.address)
    // }
   // console.log(address, typeof address)

    //if(!address) address = JSON.parse(req.body.address)

    // if(! validator.isValidBody(address)){
    //     return res.status(400).send({status:false, message:"invalid address or address is not in proper format"})
    // }


    if(address){
        console.log(address)
        
        const isAddressExists = await userModel.findOne({_id:userId, isDeleted:false})

        if(!isAddressExists){
            return res.status(404).send({status:false, message:`user with this ID: ${userId} is not found`})
        }

        let updateAddress = isAddressExists.address
        console.log(updateAddress)

        console.log(address, typeof address)

        if(address.shipping){
            
            // if (address.shipping.street="") {
            //     return res
            //       .status(400)
            //       .send({ status: false, message: "enter valid shipping street address" });
            //   }
            //   console.log(address.shipping.street, typeof address.shipping.street)

            if(address.shipping.street){

                if (!validator.isValid(address.shipping.street)) {
                    return res
                      .status(400)
                      .send({ status: false, message: "enter valid shipping street address" });
                  }
                updateAddress.shipping.street  = address.shipping.street

            }

            // if (address.shipping.pincode="") {
            //     return res
            //       .status(400)
            //       .send({ status: false, message: "enter valid shipping pincode address" });
            //   }

            
            if(address.shipping.pincode){

                if (!validator.isValid(address.shipping.pincode)) {
                    return res
                      .status(400)
                      .send({ status: false, message: "enter valid shipping pincode address" });
                  }

                
                  if (!/^[1-9]{1}[0-9]{5}$/.test(address.shipping.pincode)) {
                    return res
                      .status(422)
                      .send({
                        status: false,
                        message: `${address.shipping.pincode}enter valid shipping picode of 6 digit and which do not start with 0`,
                      });
                }

                updateAddress.shipping.pincode  = address.shipping.pincode
            }


            // if (address.shipping.city="") {
            //     return res
            //       .status(400)
            //       .send({ status: false, message: "enter valid shipping city address" });
            //   }

            if(address.shipping.city){

                if (!validator.isValid(address.shipping.city)) {
                    return res
                      .status(400)
                      .send({ status: false, message: "enter valid shipping city address" });
                  }

                updateAddress.shipping.city  = address.shipping.city
                
            }
        }



        if(address.billing){

            // if (address.billing.street="") {
            //     return res
            //       .status(400)
            //       .send({ status: false, message: "enter valid billing street address" });
            //   }
            if(address.billing.street){

                if (!validator.isValid(address.billing.street)) {
                    return res
                      .status(400)
                      .send({ status: false, message: "enter valid billing street address" });
                  }

                updateAddress.billing.street  = address.billing.street

            }


            // if (address.billing.pincode="") {
            //     return res
            //       .status(400)
            //       .send({ status: false, message: "enter valid billing pincode address" });
            //   }
            if(address.billing.pincode){

                if (!validator.isValid(address.billing.pincode)) {
                    return res
                      .status(400)
                      .send({ status: false, message: "enter valid billing pincodeaddress" });
                  }

                if (!/^[1-9]{1}[0-9]{5}$/.test(address.billing.pincode)) {
                    return res
                      .status(422)
                      .send({
                        status: false,
                        message: `${address.billing.pincode}enter valid billing picode of 6 digit and which do not start with 0`,
                      });
                }
                  

                updateAddress.billing.pincode  = address.billing.pincode
            }

            // if (address.billing.city="") {
            //     return res
            //       .status(400)
            //       .send({ status: false, message: "enter valid billing city address" });
            //   }
            if(address.billing.city){

                if (!validator.isValid(address.billing.city)) {
                    return res
                      .status(400)
                      .send({ status: false, message: "enter valid billing city address" });
                  }


                updateAddress.billing.city = address.billing.city
            }   
        }


        req.body.address = updateAddress
    }








    const update = req.body


    const updatedData = await userModel.findOneAndUpdate({ _id: userId },update,{ new:true})
        if (updatedData) {
            return res.status(200).send({ status: true, msg: "user profile updated", data: updatedData })
        } else {
            return res.status(400).send({ status: false, msg: "userid does not exist" })
        }

   

} catch(error){
    return res.status(500).send({status:false, message:error.message})
}


}
























module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
module.exports.updateUser = updateUser;
