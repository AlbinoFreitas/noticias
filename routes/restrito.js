const express = require('express')

const Noticia = require('../models/noticia')

const router = express.Router()

router.use((req, res, next) => {
    if('user' in req.session){
        return next()
    }
    res.redirect('/login')
})

router.get('/noticias', async (req, res) => {
    const noticias = await Noticia.find({ category: 'private'})
    res.render('noticias/restrito', { noticias })
})

module.exports = router