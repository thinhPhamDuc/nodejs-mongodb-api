const express = require('express');
const { parseurl, url } = require('../controllers/urlController');
const router = express.Router();

router.post('/short-url', parseurl)
router.get('/url/:urlId', url)


module.exports = router; 
