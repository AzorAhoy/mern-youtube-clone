const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
var ffmpeg = require('fluent-ffmpeg');
const { Comment } = require('../models/Comment');
//=================================
//             Comment
//=================================


router.post("/saveComment", (req, res) => {
    const comment = new Comment(req.body);
    comment.save((err, doc) => {
        if (err) {
            return res.json({ success: false, err })
        }
        Comment.find({'_id': comment._id})
        .populate('writer')
        .exec((err, result) => {
            if (err) {
                return res.json({ success: false, err })
            }
            return res.status(200).json({ success: true, result })
        })
        
    })

});

router.post("/unsubscribe", (req, res) => {
    Comment.findOneAndDelete({ "userTo": req.body.userTo, "userFrom": req.body.userFrom })
        .exec((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }

            return res.status(200).json({
                success: true,
                doc
            })
        })
});

router.post("/getComments", (req, res) => {
    Comment.find({ "postId": req.body.videoId})
    .populate('writer')
        .exec((err, comments) => {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }

            return res.status(200).json({
                success: true,
                comments
            })
        })
});

module.exports = router;
