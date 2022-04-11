const express = require('express')
const router = express.Router()
const useController = require("../controller/userController")



router.get('test-me', function(req,res){
    res.send("hello from get api")
})

router.post('/createUser', useController.registerUser)
router.get('/loginUser', useController.loginUser)



module.exports = router