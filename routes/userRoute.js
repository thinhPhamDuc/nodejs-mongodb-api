const express = require('express');
const { register,login,profile, update } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register)

router.post('/login', login)

router.get('/profile', profile)

router.put('/profile/update', update)


module.exports = router; 
