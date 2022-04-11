const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
//const { urlencoded } = require('body-parser')
const routes = require('./src/route/routes')
const multer = require('multer')



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(multer().any())

mongoose.connect('mongodb+srv://rohankesarkar:rohan123@cluster0.sgev7.mongodb.net/group32Database',
 {useNewUrlParser:true}
)
.then(() => {console.log("mongoDb connected")})
.catch((err) => console.log(err))


app.use('/',routes)

app.listen(process.env.PORT || 3000 , function(){
    console.log('express is running on port',+( process.env.PORT || 3000))
});