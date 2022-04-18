const orderModel = require("../models/orderModel")
const validator  = require("../validator/validator")
//const cartModel = require("../models/cartModel")



const createOrder = async function (req, res) {
    try {
        
        req.body.userId = req.params.userId
        let totalQuantity = 0;

        if(!validator.isValidBody(req.body)){
            return res.status(400).send({status:false, message:"Bad Request request body is empty"})
        }
        const {items, totalPrice,  totalItems} = req.body

        const validItems =  items.filter((obj) => {
            return obj != null && Object.keys(obj).length
        })
    
        if(!(items.length && validItems.length)){
            return res.status(400).send({staus:false, message:"please select the product to place order"})
        }
        
        if(!(validator.isValidPrice(totalPrice) && validator.isValid(totalPrice))){
            return res.status(400).send({status:false, message:"pease provide price or enter valid price"})
        }

        if(!(/^[1-9]{1}[0-9]{0,15}$/.test(totalItems) && validator.isValid(totalItems))){ 

            return res.status(400).send({status:false, message:"Bad request please provoide valid totalItems"})
        
        }


            items.forEach((productObj) => {
                    totalQuantity += Number(productObj.quantity)
                })
        req.body.totalQuantity = totalQuantity



        // if (!(validator.isValidobjectId(cartId))) {
        //     return res.status(400).send({ status: false, msg: "please provide valid cartId" })

        // }

//         if (!isValid(userId)) {
//             return res.status(400).send({ status: false, msg: "please provide userId" })
//         }
// const isExistUserId = await userModel.findOne({ _id: userId , _id:})
//         if (!isExistUserId) {


            // const cartPresent = await cartModel.findById({ userId: userId}).select({ items: 1 , totalPrice: 1 , totalItems: 1 })
            // let orderObj = {}
            // if (cartPresent) {
            //     cartPresent.items.forEach((productObj) => {
            //         totalQuantity += Number(productObj.quantity)
            //     })
            //     orderObj = {
            //         userId: userId,
            //         items: cartPresent.items,
            //         totalPrice: cartPresent.totalPrice,
            //         totalItems: cartPresent.totalItems,
            //         totalQuantity: totalQuantity
            //     }
            //     const orderData = await orderModel.create(orderObj)
            //     return res.status(201).send({ status: true, msg: "Order created succesfully", data: orderData })
            // } else {
            //     return res.status(404).send({ status: fase, msg: "Cart not found" })
            // }
       // }

           const orderData = await orderModel.create(req.body)
             return res.status(201).send({ status: true, msg: "Order created succesfully", data: orderData })


    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



// {
//     userId: {ObjectId, refs to User, mandatory},
//     items: [{
//       productId: {ObjectId, refs to Product model, mandatory},
//       quantity: {number, mandatory, min 1}
//     }],
//     totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
//     totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
//     totalQuantity: {number, mandatory, comment: "Holds total number of items in the cart"},
//     cancellable: {boolean, default: true},
//     status: {string, default: 'pending', enum[pending, completed, cancled]},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }





const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        let { orderId , status} = req.body

        // if (!validator.isValidobjectId(userId)) {
        //     return res.status(400).send({ status: false, msg: "invalid userId" })
        // }
        // const userExist = await userModel.findById({ _id: userId })
        // if (!userExist) {
        //     return res.status(404).send({ status: false, msg: "user not found" })
        // }



        if (!validator.isValidobjectId(orderId)) {
            return res.status(400).send({ status: false, msg: "invalid orderId" })
        }

        const orderExist = await orderModel.findOne({ orderId: orderId, userId:userId, isDeleted: false })
        if (!orderExist) {
            return res.status(404).send({ status: false, msg: "order does not exist" })
        }
        console.log(orderExist, orderExist.status)
        if(orderExist.status == "completed"){
            return res.status(400).send({status:false, message:"this order is already completed you can not change the status"})
        }
        if(orderExist.status == "cancled"){
            return res.status(400).send({status:false, message:"this order is already cancled you can not change the status"})
        }
        
        if(!["pending", "completed", "cancled"].includes(status)){
            return res.status(400).send({status:"false", message:"status is invalid you can only completed or cancle order"})
        }
        if (orderExist.cancellable != true && status == "cancled") {
            return res.status(400).send({ status: false, msg: "order can not be cancel" })
        }
        // if (userId != orderExist.userId) {
        //     return res.status(400).send({ status: false, msg: "credentials are not matching" })
        // }
        const updatedOrder = await orderModel.findOneAndUpdate({ _id: orderId, isDeleted: false },
             { status: status }, { new: true })
       
            return res.status(200).send({ status: false, msg: "order updated successfully", data: updatedOrder })
        
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
















module.exports.updateOrder = updateOrder










module.exports.createOrder = createOrder



