import { useEffect } from 'react';
import { useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import ARBusinessCardSlots from '../home/ARBusinessCardSlots';
import { Link, useNavigate } from 'react-router-dom';

import { Row, Col } from 'antd';
//import { useExistingDocuments } from './useExistingDocuments';
//import AR_Cards from '../AR_Cards/AR_Cards';

//styles
import styles from './Dashboard.module.css';
import { where } from 'firebase/firestore';

/**
 * Dashboard - Displays created Business Cards from the build (Home.jsx)
 * 
 * @returns : Dashboard JSX elemnts where ARBusinessCardSlots.jsx will display
 */
export default function Dashboard() {

    const [refreshed, setRefreshed] = useState(false);
    const { user, authIsReady } = useAuthContext();
    const { documents, error } = useCollection(
      "profile_info",
      [where("uid", "==", user?.uid)],
      user?.uid as string 
    );
    
    if (!documents) {
        console.log("No fucking documents")
    } else {
        console.log("Documents!: ", documents);
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!authIsReady) {

        };
        if (!user) {
            navigate('/login');
        }
    }, [authIsReady, user]);
    
    const handleRefresh = () => {
        setRefreshed(true);
        window.location.reload();
    }

    if (!authIsReady) {
        return <div>Loading...</div>;
    }
    
    if (user && !user.photoURL) {
        return (
            <Row gutter={0} justify="center" align="middle" className={styles['fill-form']}>
                <Col span={24} xs={24} sm={24} md={24}>
                    <Result
                        icon={<SmileOutlined />}
                        title="Your AR-Rolodex Profile has been submitted. Please check your e-mail for official confirmation."
                        extra={<Button type="primary" onClick={handleRefresh}>Go to Profile</Button>}
                    />
                </Col>
            </Row>
        )
    }

    if (refreshed) {
        return <Link to="/"/>;
    }

    return (
        <>
            {user && authIsReady && user.photoURL && documents && (
                <Row gutter={0} justify="center" align="middle" className={styles['login-form']}>
                    <Col span={24} xs={24} sm={24} md={24}>
                        <div>
                            <h2 className="page-title">Dashboard</h2>
                            {error && <p className='error'>{error}</p>}
                            <div className='card-spacing'>
                                {documents && <ARBusinessCardSlots BusinessCard={documents}/>}
                            </div>
                        </div>
                    </Col>
                </Row>

            )}
        </>
    )
}
