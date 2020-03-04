const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");
const Schema = mongoose.Schema;

const VideoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: String,
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number
    },
    thumbnail: {
        type: String
    }
}, {timeStamps: true})

const Video = mongoose.model('Video', VideoSchema);

module.exports = { Video }