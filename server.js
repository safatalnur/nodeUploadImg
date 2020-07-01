const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const path = require('path')

const mongodb = require('mongodb')

const app = express()

//use the middleware of bodyparser

app.use(bodyParser.urlencoded({extended: true}))

//Multer libray
var storage = multer.diskStorage({
    destination: function(req,res,cb) {
        cb(null, 'uploads')
    },
    filename: function(req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

//Configuring MongoDB

const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017'

MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err,client) => {
    if(err) return console.log(eff)

    db = client.db('Images')

    app.listen(3000, ()=> {
        console.log("Mongodb server Listening at 3000")
    })
})

//configure the home route
app.get('/',(req, res)=> {
    res.sendFile(__dirname + '/index.html')
})

//Configuring the upload file route

app.post('/uploadfile', upload.single('myFile'), (req,res,next)=> {
    const file = req.file

    if(!file) {
        const error = new Error("Please upload a file")
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

//Configure the multiple file route

app.post("/uploadMultiple", upload.array('myFiles', 12),(req,res,next)=> {
    const files = req.files
    if(!files) {
        const error = new Error("Please upload a files")
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
})