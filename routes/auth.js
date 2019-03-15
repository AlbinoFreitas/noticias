const express = require('express')

const User = require('../models/user')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
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