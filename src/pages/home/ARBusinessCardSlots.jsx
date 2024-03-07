//import { useFirestore } from '../../hooks/useFirestore';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from './ARBC.module.css';
import { Row, Col } from 'antd';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function BusinessCardSlot ({ BusinessCard }) {

    //const { deletedDocument, response } = useFirestore('profile_info');
    //const { response } = useFirestore('profile_info');
    //console.log("response from AR_BusinessCardSlots.js: ", response);
    const { user } = useAuthContext();

    const handleClick = async (id) => {
        const ref = doc(db, 'profile_info', id);
        await deleteDoc(ref);
    }

    if (!BusinessCard || !Array.isArray(BusinessCard)) {
        return <p>No Business Card created yet!</p>;
    }

    return (
        <Row gutter={0} justify="center" align="middle" className={styles['login-form']}>
            <Col span={24} xs={24} sm={24} md={24}>
                <div className='project-list'>
                    {BusinessCard.length === 0 && <p>No Business Card created yet!</p>}
                    {BusinessCard.map(BusinessCard => (
                        <Link to={`/profile_info/${BusinessCard.id}`} key={BusinessCard.id}>
                            <h4>{BusinessCard.name}</h4>
                            <Link to='/ar_cards' className={styles['button-56']} >
                                <p key={BusinessCard.id}>{user.displayName}'s begun creating an AR-Card</p>
                                <button onClick={() => handleClick(BusinessCard.id)}>x</button>
                            </Link>
                        </Link>
                    ))}
                </div>
            </Col>
        </Row>
        /*<ul className={styles['button-56']}>
            {BusinessCard.map((card) => {
                <li key={card.id}>
                    <p>{card.name}</p>
                    <button onClick={() => handleClick(card.id)}>x</button>
                </li>
            })}
        </ul>*/
    )
}