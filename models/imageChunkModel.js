const mongoose = require('mongoose');

const fileChunkSchema = new mongoose.Schema({
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
    },
    n: {
        type: Number,
        required: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
});

const FileChunk = mongoose.model('FileChunk', fileChunkSchema, 'photos.chunks');

module.exports = FileChunk;
