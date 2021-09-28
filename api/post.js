const router = require('express').Router()
const models = require('../models/post')
const { uploadPhoto } = require('../middleware/multipart/upload')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const validator = require('validator');

router.post('/', uploadPhoto, async (req, res) => {
    const data = _.pick(req.body, ['title', 'description'])
    if(_.isEmpty(data)) return res.status(400).send({error : 'required data missing'})
    if(data.title==null || validator.isEmpty(data.title, { ignore_whitespace: true })) return res.status(500).send({error : 'input valid title'})
    if(data.description==null || validator.isEmpty(data.description, { ignore_whitespace: true })) return res.status(500).send({error : 'input valid content'})
    
    try {
        const post = await models.Post.create(data)
        if(post) return res.status(201).send()
        throw new Error('Post not created')
    } catch(e) {
        err_log(req.method, req.url, e.message)
        res.status(500).send()
    }
})

module.exports = router