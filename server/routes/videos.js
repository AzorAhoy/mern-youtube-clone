const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
var ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');
//=================================
//             Video
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        console.log(ext);
        console.log(ext !== ".mp4")
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    // fileFilter: (req, file, cb) => {
    //     const ext = path.extname(file.originalname)
    //     if (ext !== '.mp4') {
    //         console.log("Here!");
    //         return cb(new Error('Only images are allowed'));
    //     }
    //     cb(null, true)
    // }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb, res) => {
        const ext = path.extname(file.originalname);
        if (ext != '.mp4') {
            console.log("Here!");
            return cb('Only .mp4 files are allowed');
            //return cb(res.status(400).send('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
}).single("file")


router.post("/uploadFiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
});

router.post("/thumbnail", (req, res) => {
    let thumbsFilePath = "";
    let fileDurartion = "";

    ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {

        console.log("metadata: ");
        console.dir(metadata);
        if (err) {
            console.log(err);
        }
        //return res.json({success: true,metadata: metadata});
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames, err) {
            console.log('Will generate ' + filenames.join(', '));
            if (err) {
                console.log(err);
            }
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function (err) {
            console.log('Screenshots taken');
            if (err) {
                console.log(err);
            }
            return res.json({
                success: true,
                thumbsFilePath: thumbsFilePath,
                fileDuration: fileDuration
            })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            //%b input basename (filename w/o extension)
            filename: 'thumbnail-%b.png'
        });
});

router.post("/uploadVideo", (req, res) => {
    const video = new Video(req.body);
    video.save((err, video) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true,
        })
    })
});

router.get("/getVideos", (req, res) => {
    const video = new Video(req.body);
    Video.find().populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({
                success: true,
                videos
            })
        })
});

router.post("/getVideo", (req, res) => {
    const video = new Video(req.body);
    Video.findOne({ _id: req.body.videoId }).populate('writer')
        .exec((err, video) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({
                success: true,
                video
            })
        })
});

router.post("/getSubscriptionVideos", (req, res) => {
    //Find all of the user that you are subscribing to from Subscriber collection
    Subscriber.find({ 'userFrom': req.body.userFrom })
        .exec((err, subscribers) => {
            if (err) return res.status(400).send(err);
            let subscribedUsers = [];
            subscribers.map((item, i) => {
                subscribedUsers.push(item.userTo)
            })

            //Fetch all videos that belong to the user thay you subscribed to to
            Video.find({ writer: { $in: subscribedUsers } })
                .populate('writer').exec((err1, videos) => {
                    if (err1) return res.status(400).send(err1);
                    return res.status(200).json({
                        success: true,
                        videos
                    })
                })
        })
});

module.exports = router;
