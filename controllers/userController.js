const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
    try {
        const user = await User.findOne({ name: req.body.name });
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (error, response) {
              if (response) {
                // Create a JWT token with the user's ID as the payload
                const token = jwt.sign({ userId: user._id }, 'yourSecretKey', {expiresIn: '24h'});
      
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


const profile = asyncHandler(async (req, res) => {
  try {
    const token = req.header('authorization');
    const data = extractUserId(token);
    const user = await User.findById(data.userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found')
    }

  } catch (error) {
      res.status(400).json({ error });
  }
})

const extractUserId = (token) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

function generateOTP() {
  // Generate a random 6-digit OTP (you can adjust the length as needed)
  return Math.floor(100000 + Math.random() * 900000);
}

const sendingOTPMail = (email) => {
  const otp = generateOTP(); // Generate OTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "phamducthinhbeo@gmail.com",
        pass: "ztldthwwhvivvxwl"
    }
  });

  const mailOptions = {
    from: 'phamducthinhbeo@gmail.com', // Sender's email address
    to: email, // Recipient's email address
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error.message);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  return otp; // Return the generated OTP
};


const update = asyncHandler(async (req, res) => {
  try {
    const token = req.header('authorization');
    const data = extractUserId(token);

    if (req.body.email) {
      const otp = sendingOTPMail(req.body.email); 
      console.log(otp);
      otpStore[data.userId] = otp;
    }

    const user = await User.findByIdAndUpdate(data.userId, req.body);
    if (!user) {
      return res.status(404).json({ message: 'Cannot find this user' });
    }

    const updatedUser = await User.findById(data.userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = {
    register,
    login,
    profile,
    update
}