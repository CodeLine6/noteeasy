const express = require('express');
const uploadImage = require('../controllers/editor/image/upload');
const deleteImage = require('../controllers/editor/image/delete');
const router = express.Router();

router.post('/image/upload', uploadImage);
router.get('/image/delete/:id', deleteImage);

module.exports = router