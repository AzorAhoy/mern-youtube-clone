import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState('');
    const [OpenReply, setOpenReply] = useState(false);

    const handleChange = (e) => {
        setCommentValue(e.target.value);
    }

    const openReply = () => {
        setOpenReply(!OpenReply);
    }
    const action = [
        <LikeDislikes
            comment
            commentId={props.comment._id}
            //videoId={videoId}
            userId={localStorage.getItem('userId')}
        />,
        <span onClick={openReply} key="comment-basic-replay-to">Reply to</span>
    ]
    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }


        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    return (
        <div>
            <Comment
                actions={action}
                author={props.comment.writer.name}
                avatar={
                    <Avatar
                        src={props.comment.writer.image}
                        alt="avatar"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            >

            </Comment>
            {OpenReply &&
                <form style={{ display: 'flex' }}
                //onSubmit={onSubmit}
                >
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="write some comment"
                    />
                    <br />
                    <Button
                        style={{ width: '20%', height: '52px' }}
                        onClick={onSubmit}
                    >
                        Submit</Button>
                </form>
            }

        </div>
    );
}

export default SingleComment;