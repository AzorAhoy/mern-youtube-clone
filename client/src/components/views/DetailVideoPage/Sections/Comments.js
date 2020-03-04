import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;

function Comments(props) {
    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = (e) => {
        console.log(e.target.value);
        setComment(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }
        axios.post('/api/comment/saveComment', variables)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data);
                    setComment("");
                    props.refreshFunction(res.data.result);
                } else {
                    alert("Error saving comment.")
                }
            })
    }

    return (
        <div>
            <br />
            <p> replies</p>
            <hr />
            {/* Comment lists */}
            {props.CommentList && props.CommentList.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={index}>
                        <SingleComment
                            comment={comment}
                            postId={props.postId}
                            refreshFunction={props.refreshFunction}
                        />
                        <ReplyComment
                            CommentList={props.CommentList}
                            postId={props.postId}
                            parentCommentId={comment._id}
                            refreshFunction={props.refreshFunction}
                        />
                    </React.Fragment>
                )

            ))}
            {/*Root comment form*/}
            <form
                style={{ display: 'flex' }}
                onSubmit={onSubmit}
            >
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    );
}

export default Comments;