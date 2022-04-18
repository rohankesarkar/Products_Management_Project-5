const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
   // if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
//  && typeof value === ['string']

const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidCurrencyId = function (currencyId) {
    return ['INR'].indexOf(currencyId) !== -1
}

const isValidPhone = function (value) {
    if (!(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidEmail = function (value) {
    if (!(/^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidPassword = function(value) {
    if(!(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidPrice = function(value){
    if(!(/^\d{0,8}(\.\d{1,2})?$/.test(value))){
        return false
    }
    return true
}

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidPinCode = function(value){
    if(!(/^[1-9][0-9]{5}$/.test(value.trim()))){
        return false
    }
    return true
}




const isValidDate = (date) => {
    //instead we can use date regex
    const specificDate = new Date(date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return specificDate < today;
}

const isValidCurrencyFormat = function (currencyFormat) {
    return ['₹'].indexOf(currencyFormat) !== -1
}

const isValidSize =  function (size){
    const availableSizes = ["S", "XS","M","X", "L","XXL", "XL"]
    let wrongSizes = []
    for(let i=0; i<size.length; i++){
        if(!(availableSizes.includes(size[i]))){
           // return res.status(400).send({status:false, message:`invalid availableSizes for ${size[i]} size`})
           wrongSizes.push(size[i])
        }
    }
    if(wrongSizes.length){
        return wrongSizes
    } else {
        return true
    }
   

}





module.exports= {isValid,isValidBody,isValidCurrencyId,isValidPhone,isValidEmail,
                isValidPassword,isValidobjectId,isValidDate,isValidPinCode,isValidPrice,
                isValidCurrencyFormat,isValidSize}

              
// module.exports.isValidBody = isValidBody
// module.exports.isValidCurrencyId = isValidCurrencyId
// module.exports.isValidPhone = isValidPhone
// module.exports.isValidEmail = isValidEmail
// module.exports.isValidPassword = isValidPassword
// module.exports.isValidobjectId = isValidobjectId
// module.exports.isValidDate = isValidDate
// module.exports.isValidPinCode = isValidPinCode
// module.exports.isValidPrice = isValidPrice
// module.exports.isValidCurrencyFormat = isValidCurrencyFormat
// module.exports.isValidSize = isValidSize