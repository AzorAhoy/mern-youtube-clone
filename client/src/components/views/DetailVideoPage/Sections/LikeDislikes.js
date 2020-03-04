import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variables = {

    }

    if (props.video) {
        variables = {
            videoId: props.videoId,
            userId: props.userId
        }

    } else {
        variables = {
            commentId: props.commentId,
            userId: props.userId
        }
    }

    useEffect(() => {
        axios.post('/api/like/getLikes', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    //number of likes
                    setLikes(response.data.likes.length);
                    //check if already liked
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked');
                        }
                    })
                    // setCommentValue("")
                    // setOpenReply(!OpenReply)
                    // props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to get Likes')
                }
            })

        axios.post('/api/like/getDislikes', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    //number of likes
                    setDislikes(response.data.dislikes.length);
                    //check if already liked
                    response.data.dislikes.map(like => {
                        if (like.userId === props.userId) {
                            setDislikeAction('disliked');
                        }
                    })

                } else {
                    alert('Failed to get Dislikes')
                }
            })
    }, [])

    const onLike = () => {
        if (LikeAction === null) {
            axios.post('/api/like/like', variables)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1);
                        setLikeAction('liked');
                        //if already disliked
                        if (DislikeAction !== null) {
                            setDislikeAction(null);
                            setDislikes(Dislikes - 1);
                        }

                    } else {
                        alert('Failed to like');
                    }
                })
        } else {
            axios.post('/api/like/unlike', variables)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes - 1);
                        setLikeAction(null);
                    } else {
                        alert('Failed to unlike');
                    }
                })
        }
    }

    const onDislike = () => {
        if (DislikeAction === null) {
            axios.post('/api/like/dislike', variables)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1);
                        setDislikeAction('disliked');
                        //if already disliked
                        if (LikeAction !== null) {
                            setLikeAction(null);
                            setLikes(Likes - 1);   
                        }
                    } else {
                        alert('Failed to like');
                    }
                })
        } else {
            axios.post('/api/like/unDislike', variables)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1);
                        setDislikeAction(null);
                    } else {
                        alert('Failed to unlike');
                    }
                })
        }
    }

    return (
        <React.Fragment>
            <span className="comment-basic-like">
                <Tooltip title="like">
                    <Icon
                        type="like"
                        //theme="filled"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;
            <span class="comment-basic-dislike">
                <Tooltip title="dislike">
                    <Icon
                        type="dislike"
                        //theme="filled"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </React.Fragment>
    );
}

export default LikeDislikes;