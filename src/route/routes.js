const express = require('express')
const router = express.Router()
const userController = require("../controller/userController")
const productController = require("../controller/productController")
const cartController = require('../controller/cartController')
const auth = require("../middleware/middleware")



router.get('test-me', function(req,res){
    res.send("hello from get api")
})

router.post('/createUser', userController.registerUser)
router.get('/user/:userId/profile',auth.authentication, userController.getUser)
router.post('/loginUser', userController.loginUser)
router.put('/updateUser/:userId', auth.authorization, userController.updateUser)



router.post('/createproduct', productController.createProduct)
router.get('/getproduct', productController.getProduct)
router.get('/getByProductId/:productId', productController.getProductById)
router.put('/updateproduct/:productId', productController.updateProduct)
router.delete('/deleteproduct/:productId', productController.deleteProduct)

router.post('/users/:userId/cart', cartController.createCart)
router.put('/users/:userId/cart', cartController.updateCart)
router.get('/users/:userId/cart', cartController.getCartById)
router.delete('/users/:userId/cart', cartController.deleteCart)








module.exports = router