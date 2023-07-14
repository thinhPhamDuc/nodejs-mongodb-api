const mongoose = require('mongoose');

const Client = mongoose.model('Client', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
    }
}));

exports.Client = Client;