const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// user 
const register = asyncHandler(async (req, res) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            token: null
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.token = await jwt.sign({ _id: user._id }, 'PrivateKey');
        await user.save();
        res.status(200).json(user);
    }
})

const login = asyncHandler(async (req, res) => {
    // Check if this user already exisits
    try {
        // check if the user exists
        const user = await User.findOne({ name: req.body.name });
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (error, response) {
              if (response) {
                // Create a JWT token with the user's ID as the payload
                const token = jwt.sign({ userId: user._id }, 'yourSecretKey');
      
                // Send the token as the response
                res.status(200).json({ token });
              } else {
                return res.status(400).send('Password is incorrect');
              }
            });
          } else {
            res.status(400).json({ error: "User doesn't exist" });
          }
    } catch (error) {
        res.status(400).json({ error });
    }
})


module.exports = {
    register,
    login
}