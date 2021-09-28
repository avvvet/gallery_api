const router = require('express').Router()
const models = require('../models')
const { uploadPhoto } = require('../middleware/multipart/upload')
const err_log = require('../utility/error.js')
const _ = require('lodash')
const validator = require('validator');

router.post('/', uploadPhoto, async (req, res) => {
    const data = _.pick(req.body, ['title', 'description'])
    if(req.file != undefined || req.file != null) {  // data + picture
        data.photo = req.file.filename 
}
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

router.get('/', async (req,res) => {
    const {page, size} = req.query;
    const offset = (parseInt(page) -1) * parseInt(size);
    
    try {
        const post = await models.Post.findAndCountAll({offset: offset, limit: parseInt(size)})
        if(post) {
            const total_pages = Math.ceil(parseInt(post.count) / parseInt(size));
            post.total_pages = total_pages;
            post.current_page = parseInt(page);
            if(parseInt(page) > total_pages) return res.status(404).send();
            return res.status(200).send(post);
        }
        return res.status(404).send();
    } catch(e) {
        err_log(req.method, req.url, e.message)
        return res.status(500).send();
    }
});

router.delete('/', async (req, res) => {
    models.Post.destroy(
        {
            where : {}
        }
    ).then((rslt) => {
        if(rslt && rslt >= 1) return res.status(200).send();
        if(rslt == 0) return res.status(200).send({error : 'no data to delete'  })
        return res.status(400).send({error: 'not deleted'});
    }).catch((e) => {
        err_log(req.method, req.url, e.message)
        res.status(500).send();
    });
})

module.exports = router