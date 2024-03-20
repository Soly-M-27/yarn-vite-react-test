import styles from './Home.module.css';
import { useAuthContext } from '../../hooks/useAuthContext';
//import { useFirestore } from '../../hooks/useFirestore';
import { useState } from 'react';
import { Row, Col, Button, Input, Upload, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProfileInfo } from '../../hooks/useProfileInfo';
import { useNavigate } from 'react-router-dom';
//import SocialMediaTree from './SocialMediaTree';

export default function EditUpdatePage () {
  console.log("I'm in EditUpdatePage.");

  const [mind_File, setMind_File] = useState(null);
  const [formError, setformError] = useState(null);
  const navigate = useNavigate();

  //const { response } = useFirestore('profile_info');
  const { authIsReady, user } = useAuthContext();
  const { MindFile } = useProfileInfo();

  if (!authIsReady) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handling Update Info of users profile_info documents");
    setformError(null);
    navigate('/');
  };

  const handleFileChange = (e) => {
    setMind_File(null);
    let selected = e.target.files[0];
    console.log(selected);

    if (!selected) {
      setMind_File(null);
      setformError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setMind_File(null);
      setformError("Selected file must be an image");
      return;
    }
    if (!selected.size > 100000) {
      setMind_File(null);
      setformError("Image file size must be less than 100kb");
      return;
    }

    setMind_File(selected);
    setformError(null);

    console.log("Image target updated");
    console.log("mindFile in Home.jsx: ", mind_File);
    MindFile(selected);
  };

  return (
    <>
      {user && authIsReady && user.photoURL && (
        <Row
          gutter={0}
          justify="center"
          align="middle"
          className={styles["fill-form"]}
        >
          <Col span={24} xs={24} sm={24} md={24}>
            <form onSubmit={handleSubmit}>
              <div className={styles.profile}>
                <img
                  className={styles.profilePicture}
                  src={user.photoURL}
                  alt="Pic"
                />
                <h2>{user.displayName}'s Profile</h2>
              </div>
              <label>
                <span>AR-BusinessCard picture:</span>
                <input required type="file" onChange={handleFileChange} />
                {formError && (
                  <div className="error"> formError: {formError}</div>
                )}
              </label>
              <div>
                <button className="btn">Finish Edit</button>
                {formError && (
                  <div className="error"> formError: {formError}</div>
                )}
              </div>
            </form>
          </Col>
        </Row>
      )}
    </>
  );
}