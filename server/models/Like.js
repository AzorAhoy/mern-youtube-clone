const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }
}, { timeStamps: true })

const Like = mongoose.model('Like', LikeSchema);

module.exports = { Like }