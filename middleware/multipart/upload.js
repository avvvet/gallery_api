const multer = require('multer');
const dontenv = require('dotenv');
const { uuidv4 } = require('uuid');
const path = require('path');
const maxSize = parseInt(process.env.MAX_UPLOAD_SIZE_MB) * 1024 * 1024;
const err_log = require('../../utility/error');

const storage_photo = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/photo'); 
     },
    filename: function (req, file, cb) {
        cb(null , uuidv4() + path.extname(file.originalname));
    }
});

const uploadPhoto = (req, res, next) => {
    const upload = multer({
        storage: storage_photo,
        limits: { fileSize: maxSize }
    }).single('photo');
    upload(req, res, (e) => {
        if(e===null || e===undefined)  return next();
        err_log('photo-upload', e.message);
        res.status(500).send({message: e.message});
    })
}

module.exports = {uploadPhoto};