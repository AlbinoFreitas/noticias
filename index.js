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

app.use((req, res, next) => {
    if('user' in req.session){
        res.locals.user = req.session.user
    }
    next()
})
app.use('/restrito', (req, res, next) => {
    if('user' in req.session){
        return next()
    }
    res.redirect('/login')
})

app.use('/restrito', restrito)
app.use('/noticias', noticia)
app.use('/login', auth)
app.use('/', pages)

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
                console.log('server running at port: '+port)
                createInitialUser() 
            }
        })
    })
    .catch(e => console.log(e))
