import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { Button, ConfigProvider, Drawer, Space } from 'antd';
import React, { useState } from 'react';
import { Col, Row } from 'antd';
import Avatar from './Avatar';

// components
// styles & images
import styles from './Sidebar.module.css';
import DashboardIcon from '../assets/dashboard_icon.svg';
import AddIcon from '../assets/add_icon.svg';
import TempleIcon from '../assets/temple.svg';

// Define your custom theme
const customTheme = {
  components: {
    Button: {
      colorPrimary: "#00b96b",
      border: "3px solid  #e6ff40",
      borderRadius: "50%",
      boxShadow:
        "0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0,rgba(0, 0, 0, .12)",
      padding: "2px 24px",
      algorithm: true,
    },
  },
};

export default function Sidebar() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (checked) => {
    setLoading(!checked);
  };

  return (
    <>
      <ConfigProvider theme={customTheme}>
        {user && (
          <Row
            gutter={0}
            justify="center"
            align="middle"
            style={{
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Col span={24} xs={24} sm={24} md={24}>
              <div className={styles["space-align-container"]}>
                <div className={styles["space-align-block"]}>
                  <Space align="center">
                    <Button
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        align: "center",
                      }}
                      className={styles['button-17']}
                      type="primary"
                      onClick={showDrawer}
                    >
                      Sidebar
                    </Button>
                  </Space>
                </div>
                <Drawer
                  title="Sidebar"
                  placement="left"
                  closable={false}
                  onClose={onClose}
                  open={open}
                  style={{ backgroundColor: "#ddfde6" }}
                >
                  <div style={{ padding: "20px" }}>
                    <div style={{ marginBottom: "20px" }}>
                      <img src={TempleIcon} className={styles["temple-icon"]} />
                      <Avatar src={user.photoURL} />
                      <h2 style={{ marginTop: "20px" }}>
                        {user.displayName}'s sidebar
                      </h2>
                    </div>
                    <nav style={{ marginTop: "30px", marginLeft: "20px" }}>
                      <ul>
                        <li style={{ marginTop: "10px" }} onClick={onClose}>
                          <Link to="/" >
                            <img
                              src={DashboardIcon}
                              alt="dashboard icon"
                              style={{
                                marginRight: "10px",
                                verticalAlign: "middle",
                              }}
                            />
                            <span
                              style={{ fontWeight: "bold", fontSize: "20px" }}
                            >
                              Dashboard
                            </span>
                          </Link>
                        </li>
                        <li style={{ marginTop: "10px" }} onClick={onClose}>
                          <Link to="/form" >
                            <img
                              src={AddIcon}
                              alt="add project icon"
                              style={{
                                marginRight: "10px",
                                verticalAlign: "middle",
                              }}
                            />
                            <span
                              style={{ fontWeight: "bold", fontSize: "20px" }}
                            >
                              New Build
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <Button
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      width: "45px",
                      height: "45px",
                      position: "absolute",
                      top: "550px",
                      left: "245px",
                    }}
                    type="primary"
                    onClick={onClose}
                    checked={!loading} onChange={onChange}
                  >
                    X
                  </Button>
                </Drawer>
              </div>
            </Col>
          </Row>
        )}
      </ConfigProvider>
    </>
  );
}