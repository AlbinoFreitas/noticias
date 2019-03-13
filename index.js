const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')

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

const createInitialUser = async () => {
    const total = await User.countDocuments({ username: 'albinofreitas' })
    if(total === 0){
        const user = new User({
            username: 'albinofreitas',
            password: '123456'
        })
        await user.save()
    }
}

mongoose
    .connect(mongo, { useNewUrlParser: true })
    .then(() => {
        app.listen(port, (err) => {
            if(!err){
                console.log('server running')
                createInitialUser() 
            }
        })
    })
    .catch(e => console.log(e))
