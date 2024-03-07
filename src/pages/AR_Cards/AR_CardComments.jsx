import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useState } from "react";
import { timestamp } from "../../firebase/config";
import { Col, Row } from 'antd';

export default function AR_CardComments({ ar_cardToComment }) {

    const { updateDocument, response } = useFirestore('profile_info');
    const [newComment, setNewComment] = useState('');
    const { user } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random()
        }

        await updateDocument(ar_cardToComment.id, {
            comments: [...ar_cardToComment.comments, commentToAdd]
        });
        if (!response.error) {
            setNewComment('');
        }
    }

    return (
        <>
            <Row gutter={0} justify="center" className={styles.navbar}>
                <Col span={24} xs={24} sm={24} md={24}>
                    <div className="project-comments">
                        <h4>{user.displayName}'s comment section</h4>
                        <ul>
                            {ar_cardToComment.comments.length > 0 && ar_cardToComment.comments.map(comments => (
                                <li key={comment.id}>
                                    <div className="comment-author">
                                        <img src={user.photoURL} />
                                        <p>{comments.displayName}</p>
                                    </div>
                                    <div className="comment-date">
                                        <p>date here</p>
                                    </div>
                                    <div>
                                        <p>{comment.content}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <form className="add-comment" onSubmit={handleSubmit}>
                            <label>
                                <span>Add new comment:</span>
                                <textarea
                                    required
                                    onChange={(e) => setNewComment(e.target.value)}
                                    value={newComment}
                                ></textarea>
                            </label>
                            <button className="btn">Add Comment</button>
                        </form>
                    </div>
                </Col>
            </Row>
        </>
    )
}