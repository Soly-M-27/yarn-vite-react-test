import React, { useEffect } from 'react';
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

/**
 * Dashboard - Displays created Business Cards from the build (Home.jsx)
 * 
 * @returns : Dashboard JSX elemnts where ARBusinessCardSlots.jsx will display
 */
export default function Dashboard() {

    const [refreshed, setRefreshed] = useState(false);
    const { user, authIsReady } = useAuthContext();
    const { documents, errorC } = useCollection(
      "profile_info",
      user ? ["uid", "==", user.uid] : [], // An array being passed as a function parameter. We're saying only fetch the docs where the uid property of the doc is equal to the uid of the user
      ["createdAt", "desc"],
      user.uid //Pass the user's UID directly
    );
    
    if (!documents) {
        console.log("No fucking documents")
    } else {
        console.log("Documents!: ", documents);
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!authIsReady) return <div>Loading...</div>;
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
            <Row gutter={0} justify="center" align="middle" >
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
          <Row
            gutter={0} justify="center" align="middle"
            className={styles["page-title"]}
          >
            <Col span={24} xs={24} sm={24} md={24}>
              <div>
                <h2>Dashboard</h2>
                {errorC && <p className="error">{errorC}</p>}
                <div>
                  {documents && (
                    <ARBusinessCardSlots BusinessCard={documents} />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}
      </>
    );
}