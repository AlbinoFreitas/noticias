const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const port = process.env.PORT || 3000
const app = express()
const mongo = process.env.MONGO || 'mongodb://localhost/noticias'
mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

mongoose
    .connect(mongo, { useNewUrlParser: true })
    .then(() => {
        app.listen(port, (err) => {
            if(!err){
                console.log('server running')
            }
        })
    })
    .catch(e => console.log(e))
