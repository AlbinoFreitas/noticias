const express = require('express')

const Noticia = require('../models/noticia')

const router = express.Router()

router.use((req, res, next) => {
    if('user' in req.session){
        if(req.session.user.roles.indexOf('restrito') >= 0){
            return next()
        }else{
            res.redirect('/')
        }
    }
    res.redirect('/login')
})

router.get('/noticias', async (req, res) => {
    const noticias = await Noticia.find({ category: 'private'})
    res.render('noticias/restrito', { noticias })
})

module.exports = router