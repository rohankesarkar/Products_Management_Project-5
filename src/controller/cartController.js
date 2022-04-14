const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const validator = require("../validator/validator")



const createCart = async (req, res) => {
    try{

    const userId = req.params.userId

    const requestBody = req.body
    if(!validator.isValidBody(requestBody)){
        return res.status(400).send({status:false, message:"Bad Request request body is empty"})
    }
    const {productId, quantity,totalPrice, totalItems  } = requestBody

    // if(!validator.isValid(price)){
    //     return res.status(400).send({status:false, message:"Bad Request price is invalid or empty"})
    // }
    // if(!validator.isValidPrice(price)){
    //     return res.status(400).send({status:false, message:"Bad Request price is invalid it only accepts number & digits"})
    // }
    // const isItemPresent = items.filter((elem) =>{
    //     return elem.trim()
    // })
    // if(!(validator.isValidBody(items) && validator.isValidBody(isItemPresent))){
    //     return res.status(400).send({status:false, message:"Bad Request request there no product in cart"})

    // } 
     
    
         if (!productId) {
            return res.status(400).send({
              status: false,
              msg: `productId is must please provide productId`,
            });
          }
          if (!validator.isValidobjectId(productId)) {
            return res
              .status(400)
              .send({ status: false, message: `this productId ${productId} Invalid` });
          }
          let productPresent = await productModel.findOne({
            _id: productId,
            isDeleted: false,
          });


          if (!productPresent) {
            return res
              .status(404)
              .send({ status: false, message: `product with this id : ${productId} not found`});
          }

          

          


          if (quantity){

            if(!validator.isValid(quantity)){
            return res.status(400).send({
              status: false,
              msg: `quantity is must please provide`,
            });
            }

            if(!/^[1-9]{1}[0-9]{1,15}$/.test(quantity)){
                return res.status(400).send({status:false, message:"Bad request please provoide valid quantity with minimum 1 number"})
            }
            

          }
          console.log(Number(productPresent.installments), ( Number(quantity) || 1))
          if(!(Number(productPresent.installments) >= ( Number(quantity) || 1))){
                return res.status(400).send({status:false, message:`stock is less than required quantity Available Stock : ${productPresent.installments}`})
        }
        let currentInstalments = Number(productPresent.installments) - ( Number(quantity) || 1)
        console.log(currentInstalments)
        const productInsta = await productModel.findByIdAndUpdate({_id:productId},{$set:{installments:currentInstalments}},{new:true} )


         const cartExists = await cartModel.findOne({userId:userId})

         if(cartExists){

            let itemsExists = cartExists.items
            let count = 0;
            for(let i=0; i<itemsExists.length; i++){
                console.log("in")
                if(productId == itemsExists[i].productId){
                    console.log(typeof productId, typeof itemsExists[i].productId)
                    console.log("if")
                    itemsExists[i].quantity = Number(itemsExists[i].quantity) + (Number(quantity) || 1)
                    let totalCurrentProductPrice = Number( productPresent.price )* (Number(quantity) || 1)
                    cartExists.totalPrice = Number(cartExists.totalPrice) + Number(totalCurrentProductPrice)
                    const updatedCart = await cartModel.findOneAndUpdate(userId, cartExists, {new:true})
                    count++
                    return res.status(200).send({status:true, message:"updation DONE! ",data:updatedCart, productInsta:productInsta})
                   
                   
                }
            }
            if(count === 0){
                let productObj = {productId:productId, quantity:quantity}
                let totalCurrentProductPrice =  Number( productPresent.price )* (Number(quantity) || 1)
                cartExists.totalPrice = Number(cartExists.totalPrice) + Number(totalCurrentProductPrice)
                cartExists.totalItems= Number(cartExists.totalItems) + 1
                itemsExists.push(productObj)
                const updatedCart = await cartModel.findOneAndUpdate(userId, cartExists, {new:true})
                return res.status(200).send({status:true, message:"updation DONE! ",data:updatedCart,productInsta:productInsta})
                    

                
                   
            }

         }



         const cartDocument = {}
        //  const itemsObj = {
        //      productId:productId,
        //      quantity:quantity
        //  }
         let items = [{
             'productId':productId,
             'quantity':quantity
         }]
         cartDocument.userId     =  userId
         cartDocument.items      =  items
         cartDocument.totalPrice =  Number(productPresent.price) * ( Number(quantity)  || 1)
         cartDocument.totalItems =  1

         const createCart = await cartModel.create(cartDocument)
         return res.status(201).send({status:true, data:createCart, productInsta:productInsta})


        } catch (error){
            return res.status(500).send({status:false, message:error.message})

        }


}


const updateCart = async (req, res) => {
    try{

    const userId = req.params.userId
    const requestBody = req.body

    

    if(!validator.isValidBody(requestBody)){
        return res.status(400).send({status:false, message:"Bad Request request body is empty"})
    }
    const {cartId, productId} = requestBody

    
    if (!productId) {
        return res.status(400).send({
          status: false,
          msg: `productId is must please provide productId`,
        });
      }
      if (!validator.isValidobjectId(productId)) {
        return res
          .status(400)
          .send({ status: false, message: `this productId ${productId} Invalid` });
      }
      let productPresent = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });


      if (!productPresent) {
        return res
          .status(404)
          .send({ status: false, message: `product with this id : ${productId} not found`});
      }


      
    if (!cartId) {
        return res.status(400).send({
          status: false,
          msg: `cartId is must please provide cartId`,
        });
      }
      if (!validator.isValidobjectId(cartId)) {
        return res
          .status(400)
          .send({ status: false, message: `this cartId ${cartId} Invalid` });
      }
      let cartPresent = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });
      if (!cartPresent) {
        return res
          .status(404)
          .send({ status: false, message: `cart with this id : ${cartId} not found`});
      }
      const items = cartPresent.items
    

      for(let i=0; i< items.length; i++){
        console.log("for")

        if(items[i].productId == productId){
            console.log("if")
           cartPresent.items[i].quantity = Number(cartPresent.items[i].quantity) -1
            const updatedCart =await cartModel.findByIdAndUpdate({_id:cartId},cartPresent, {new:true})
            const updateProduct =await productModel.findByIdAndUpdate({_id:productId},{$inc:{installments: 1}}, {new:true})
            if(Number(items[i].quantity) == 0){
            console.log("innerif")
                
                items.splice(items[i],1)
                return res.status(200).send({status:true, message:"Success : product Remove ", data:{updatedCart,removeProduct:1,updateProduct:updateProduct}})
            } else {
                return res.status(200).send({status:true, message:"Success : product quantity decreamented ", data:{updatedCart,removeProduct:0,updateProduct:updateProduct}})
     

            }

        }

      }

      return res.status(404).send({status:false,message:`product with this ID: ${productId} is not present is your cart`})


    } catch(error) {
        return res.status(500).send({status:false, message:error.message})

    }


}

module.exports.updateCart = updateCart
module.exports.createCart = createCart