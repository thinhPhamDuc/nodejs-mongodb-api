const express = require('express');
const { register,login,profile } = require('../controllers/clientController');
const router = express.Router();

router.post('/register', register)

router.post('/login', login)

router.get('/profile', profile)

module.exports = router; 