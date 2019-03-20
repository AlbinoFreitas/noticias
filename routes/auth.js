const express = require('express')

const User = require('../models/user')

const router = express.Router()

router.use((req, res, next) => {
    if('user' in req.session){
        res.locals.user = req.session.user
    }
    next()
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/login', async (req, res) => {
    User.findOne({username: req.body.username}).then(user => {
        user.checkPassword(req.body.password).then(isValid => {
            if(isValid){
                req.session.user = user
                res.redirect('/restrito/noticias')
            }else{
                res.redirect('/login')
            }
        }).catch(() => {
            res.redirect('/login')
        })
    }).catch(() => {
        res.redirect('/login')
    })
})

module.exports = router