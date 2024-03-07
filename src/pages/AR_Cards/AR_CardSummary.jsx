import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'antd';

export default function AR_CardSummary({ ar_card }) {

    const { user } = useAuthContext();
    const { deleteDocuemnt } = useFirestore('profile_info');
    const history = useHistory();

    const handleClick = (e) => {
        deleteDocuemnt(ar_card.id);
        history.push('/');
    }

    return (
        <>
            <Row gutter={0} justify="center" className={styles.navbar}>
                <Col span={24} xs={24} sm={24} md={24}>
                    <div className="project-summary">
                        <h2 className="page-title">{ar_card.Name}</h2>
                        <p className="date">Here is NEW AR Business Card</p>
                        <img src={user.photoURL} alt="pro_pic" />
                        <p className="details">
                            <p>Belonging to: {user.displayName}</p>
                        </p>
                    </div>
                    {user.uid === ar_card.createdBy.id && (
                        <button className="btn" onClick={handleClick}>Delete this AR-Card</button>
                    )}
                </Col>
            </Row>
        </>
    )
}