import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage(props) {

    const [Videos, setVideos] = useState([]);

    let variable = {
        userFrom: localStorage.getItem('userId')
    }

    useEffect(() => {
        axios.post('/api/videos/getSubscriptionVideos', variable)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.videos);
                    setVideos(res.data.videos);
                } else {
                    alert("Failed to fetch videos");
                }
            })
    }, [])

    const renderCards = Videos.map((video, index) => {
        console.log(video.writer);
        var sec = Math.floor(video.duration % 60);
        var min = Math.floor(video.duration / 60);
        return <Col lg={6} md={8} xs={24} key={video._id}>
            <div>
                <div style={{ position: 'relative' }}>
                    <a href={`/video/${video._id}`}>

                        <img
                            style={{ width: '100%' }}
                            src={`http://localhost:5000/${video.thumbnail}`}
                            alt='thumbnail'
                        />
                        <div
                            className='duration'
                            style={{
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                margin: '4px',
                                color: '#fff',
                                backgroundColor: 'rgba(17,17,17,0.8)',
                                opacity: 0.8,
                                padding: '2px 4px',
                                borderRadius: '2px',
                                letterSpacing: '0.5px',
                                fontSize: '12px',
                                fontWeight: '500',
                                lineHeight: '12px'
                            }}>
                            <span>{min}:{sec}</span>
                        </div>
                    </a><br />
                </div><br />
                <Meta
                    avatar={
                        <Avatar src={video.writer.image} />
                    }
                    title={video.title}
                />
                <span>{video.writer.name}</span><br />
                <span style={{ marginLeft: '3rem' }}> {video.views} </span>
                - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </div>
        </Col>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>Your subscription</Title>
            <hr />
            <Row> {renderCards}</Row>

        </div>
    )
}

export default SubscriptionPage;