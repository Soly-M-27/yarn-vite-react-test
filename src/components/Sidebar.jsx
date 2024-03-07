import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { Button, ConfigProvider, Drawer, Space } from 'antd';
import React, { useState } from 'react';
//import { Col, Row } from 'antd';
import Avatar from './Avatar';

// components
// styles & images
import styles from './Sidebar.module.css';
import DashboardIcon from '../assets/dashboard_icon.svg';
import AddIcon from '../assets/add_icon.svg';

// Define your custom theme
const customTheme = {
    components: {
      Button: {
        colorPrimary: '#00b96b',
        border: '3px solid  #e6ff40',
        borderRadius: '50%',
        boxShadow: '0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0,rgba(0, 0, 0, .12)',
        padding: '2px 24px',
        algorithm: true,
      }
    },
  };

export default function Sidebar() {
    const { user } = useAuthContext();

    const [open, setOpen] = useState(true);

    const showDrawer = () => {
        setOpen(true);
    }

    const onClose = () => {
        setOpen(false);
    }

    return (
        <>
            <ConfigProvider theme={customTheme}>
                {user && (
                    <div style={{ backgroundColor: '#ddfde6', position: 'relative' }}>
                        <Space>
                            <Button style={{ position: 'absolute', top: '45px', left: '950px' }} type="primary" onClick={showDrawer}>
                                Sidebar
                            </Button>
                        </Space>
                        <Drawer
                            title="User Sidebar"
                            placement="left"
                            closable={false}
                            onClose={onClose}
                            open={open}
                            style={{ background: '#ddfde6' }}
                        >
                            <div style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <Avatar src={DashboardIcon} />
                                    <h2 style={{ marginTop: '20px' }}>displayNames sidebar</h2>
                                </div>
                                <nav style={{ marginTop: '80px', marginLeft: '20px' }}>
                                    <ul>
                                        <li style={{ marginTop: '10px' }}>
                                            <Link to="/">
                                                <img src={DashboardIcon} alt="dashboard icon" style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Dashboard</span>
                                            </Link>
                                        </li>
                                        <li style={{ marginTop: '10px' }}>
                                            <Link to="/form">
                                                <img src={AddIcon} alt="add project icon" style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>New Build</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <Button style={{ textAlign: 'center', justifyContent: 'center', width: '45px', height: '45px', position: 'absolute', top: '550px', left: '245px' }} type="primary" onClick={onClose}>
                                X
                            </Button>
                        </Drawer>
                    </div>
                )}
            </ConfigProvider>
        </>
    )
}