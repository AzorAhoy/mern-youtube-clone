const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');
//=================================
//             Like + Dislike
//=================================


router.post("/getLikes", (req, res) => {
    let variables = {};
    if (req.body.videoId) {
        variables = { videoId: req.body.videoId }
    } else {
        variables = { commentId: req.body.commentId }
    }
    Like.find(variables)
        .exec((err, likes) => {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            return res.status(200).json({
                success: true,
                likes
            })
        })
});


router.post("/like", (req, res) => {
    let variables = {};
    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId }
    }
    //save info on MongoDB
    const like = new Like(variables);
    like.save((err, result) => {
        if (err) return res.json({ success: false, err });
        //decrease Dislikes if it is already disliked
        Dislike.findOneAndDelete(variables)
            .exec((err, result2) => {
                if (err) return res.status(400).json({ success: false, err });
                return res.status(200).json({ success: true })
            })

    })



    // const like = new Like(variables)
    // //save the like information data in MongoDB
    // like.save((err, likeResult) => {
    //     if (err) return res.json({ success: false, err });
    //     //In case disLike Button is already clicked, we need to decrease the dislike by 1 
    //     Dislike.findOneAndDelete(variables)
    //         .exec((err, disLikeResult) => {
    //             if (err) return res.status(400).json({ success: false, err });
    //             res.status(200).json({ success: true })
    //         })
    // })
});


router.post("/unlike", (req, res) => {
    let variables = {};
    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Like.findOneAndDelete(variables)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
});

router.post("/getDislikes", (req, res) => {
    let variables = {};
    if (req.body.videoId) {
        variables = { videoId: req.body.videoId }
    } else {
        variables = { commentId: req.body.commentId }
    }
    Dislike.find(variables)
        .exec((err, dislikes) => {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            return res.status(200).json({
                success: true,
                dislikes
            })
        })
});


router.post("/dislike", (req, res) => {
    let variables = {};
    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId }
    }
    //save info on MongoDB
    const dislike = new Dislike(variables);
    dislike.save((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ success: false, err })
        }
        //decrease Likes if it is already liked
        Like.findOneAndDelete(variables)
            .exec((error, result2) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ success: false, error })
                }
                return res.status(200).json({ success: true, result2 })
            })
    })
});

router.post("/unDislike", (req, res) => {
    let variables = {};
    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Dislike.findOneAndDelete(variables)
        .exec((err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false, err });
            }
            res.status(200).json({ success: true, result });
            // if (err) return res.status(400).json({ success: false, err })
            // res.status(200).json({ success: true })
        })
        // 
});

module.exports = router;
