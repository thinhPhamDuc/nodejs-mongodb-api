const mongoose = require('mongoose')

const file = mongoose.Schema({})


const File = mongoose.model('photos.files',file);

module.exports = File;