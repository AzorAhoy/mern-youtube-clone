import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);
    useEffect(() => {
        let commentNumber = 0;
        props.CommentList.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
            setChildCommentNumber(commentNumber);
        });
    }, [props.CommentList, props.parentCommentId])

    let renderReplyComment = (parentCommentId) =>
        props.CommentList.map((comment, index) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentList={props.CommentList} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
                    </div>
                }
            </React.Fragment>
        ))

    // console.log(props.CommentList);
    // let temp = (parentCommentId) => props.CommentList.map((comment, index) =>
    //     <div>
    //         {
    //         comment.responseTo === parentCommentId &&
    //             <div style={{ width: '80%', marginLeft: '40px' }}>
    //                 <p>{JSON.stringify(comment)}</p>
    //                 <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
    //                 <ReplyComment CommentList={props.CommentList} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
    //             </div>
    //         }</div>
    // )

    let handleChange = () => {
        setOpenReplyComments(!OpenReplyComments);
    }

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p
                    style={{ fontSize: '14px', margin: 0, color: 'gray' }}
                    onClick={handleChange}
                >
                    {ChildCommentNumber} more comments
                </p>
            }

            {OpenReplyComments && renderReplyComment(props.parentCommentId)}
            {/* {temp(props.parentCommentId)} */}
        </div>
    );
}

export default ReplyComment;