const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const { Client } = require('../models/clientModel');
const jwt = require('jsonwebtoken');

// user 
const register = asyncHandler(async (req, res) => {
    // Check if this user already exisits
    let client = await Client.findOne({ email: req.body.email });
    if (client) {
        return res.status(400).send('That client already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        client = new Client({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            token: null
        });
        const salt = await bcrypt.genSalt(10);
        client.password = await bcrypt.hash(client.password, salt);
        client.token = await jwt.sign({ _id: client._id }, 'PrivateKey');
        await client.save();
        res.status(200).json(client);
    }
})

const login = asyncHandler(async (req, res) => {
    try {
        const client = await Client.findOne({ name: req.body.name });
        if (client) {
            bcrypt.compare(req.body.password, client.password, function (error, response) {
              if (response) {
                // Create a JWT token with the user's ID as the payload
                const token = jwt.sign({ userId: client._id }, 'yourSecretKey', {expiresIn: '24h'});
      
                // Send the token as the response
                res.status(200).json({ token });
              } else {
                return res.status(400).send('Password is incorrect');
              }
            });
          } else {
            res.status(400).json({ error: "Client doesn't exist" });
          }
    } catch (error) {
        res.status(400).json({ error });
    }
})


const profile = asyncHandler(async (req, res) => {
  try {
    const token = req.header('authorization');
    const data = extractUserId(token);
    const client = await Client.findById(data.userId);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).send('Client not found')
    }

  } catch (error) {
      res.status(400).json({ error });
  }
})

const extractUserId = (token) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

module.exports = {
    register,
    login,
    profile
}