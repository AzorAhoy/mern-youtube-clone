import React, { useEffect, useState } from 'react';
import { List, Comment, Avatar, Typography, Col, Row } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';
import Comments from './Sections/Comments';
import LikeDislikes from './Sections/LikeDislikes';

function DetailVideoPage(props) {
    const videoId = props.match.params.videoId;
    const [Video, setVideo] = useState([]);
    const [CommentList, setCommentList] = useState([]);
    const videoVariable = {
        videoId: videoId
    }

    useEffect(() => {

        Axios.post('/api/videos/getVideo/', videoVariable)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.video);
                    setVideo(res.data.video)
                } else {
                    alert('Failed to get video.')
                }
            })

        Axios.post('/api/comment/getComments/', videoVariable)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.comments);
                    setCommentList(res.data.comments)
                } else {
                    alert('Failed to get video.')
                }
            })
    }, [])

    const updateComment = (newComment) => {
        setCommentList(CommentList.concat(newComment));
    }

    if (Video.writer) {
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }}
                            src={`http://localhost:5000/${Video.filePath}`}
                            controls
                        ></video>
                        <List.Item
                            actions={[
                                <LikeDislikes
                                    video
                                    videoId={videoId}
                                    userId={localStorage.getItem('userId')}
                                />,
                                <Subscriber
                                    userTo={Video.writer._id}
                                    userFrom={localStorage.getItem('userId')}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={Video.writer && Video.writer.image}
                                    />}
                                title={<a href="https://ant.design">
                                    username<br />
                                    {Video.title}
                                </a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>
                        <Comments
                            CommentList={CommentList}
                            postId={Video._id}
                            refreshFunction={updateComment}
                        />
                    </div>
                </Col>

                <Col lg={6} xs={24}>
                    Side videos
                <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return <div>LOADING</div>
    }

}

export default DetailVideoPage;