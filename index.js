const path       = require('path')
const bodyParser = require('body-parser')
const express    = require('express')
const mongoose   = require('mongoose')
const session    = require('express-session')

const User     = require('./models/user')
const noticia  = require('./routes/noticia')
const restrito = require('./routes/restrito')
const auth     = require('./routes/auth')
const pages    = require('./routes/pages')
const admin    = require('./routes/admin')

const app        = express()
const port       = process.env.PORT || 3000
const mongo      = process.env.MONGO || 'mongodb://localhost/noticias'
mongoose.Promise = global.Promise

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({ 
    secret: 'fullstack-master', 
    resave: true, 
    saveUninitialized: true 
}))

app.use('/', auth)
app.use('/', pages)
app.use('/restrito', restrito)
app.use('/noticias', noticia)
app.use('/admin', admin)

const createInitialUser = async () => {
    const total = await User.countDocuments()
    if(total === 0){
        const admin = new User({
            username: 'admin',
            password: '123',
            roles: ['admin', 'restrito']
        })
        await admin.save()

        const user = new User({
            username: 'user',
            password: '123',
            roles: ['restrito']
        })
        await user.save()
    }
}

mongoose
    .connect(mongo, { useNewUrlParser: true })
    .then(() => {
        app.listen(port, (err) => {
            if(!err){
                console.log('server running at port: '+port)
                createInitialUser()
            }
        })
    })
    .catch(e => console.log(e))
