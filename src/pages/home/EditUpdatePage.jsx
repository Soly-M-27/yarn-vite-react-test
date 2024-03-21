//EditUpdatePage.jsx

import styles from './Home.module.css';
import { useAuthContext } from '../../hooks/useAuthContext';
//import { useFirestore } from '../../hooks/useFirestore';
import { useState } from 'react';
import { Row, Col, Button, Input, Upload, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProfileInfo } from '../../hooks/useProfileInfo';
import { useNavigate } from 'react-router-dom';
//import SocialMediaTree from './SocialMediaTree';

export default function EditUpdatePage() {
  console.log("I'm in EditUpdatePage.");

  //strings
  /*const [NameUpdate, setName] = useState("");
  const [LinktreeUpdate, setLinktree] = useState("");
  const [EmailUpdate, setWorkEmail] = useState("");
  const [LocationUpdate, setLocation] = useState("");
  const [ProfessionNameUpdate, setNameProfession] = useState("");
  const [BusinessNameUpdate, setNameBusiness] = useState("");
  const [PhoneNumUpdate, setPhoneNum] = useState("");
  const [linkChangeUpdate, setLinkChange] = useState({});
  
  //bool
  const [refreshed, setRefreshed] = useState(false);
  
  //picture files
  const [mindFileUpdate, setMind_File] = useState(null);
  
  //form errors
  const [formError, setformError] = useState(null);

  //component states & function holders
  //const { response } = useFirestore('profile_info');*/
  const { authIsReady, user } = useAuthContext();
  const { MindFile, UpdateProfileInfo } = useProfileInfo();
  const navigate = useNavigate();

  //tests
  const [mindFileUpdate, setMind_File] = useState(null);

  //Check user authorization
  if (!authIsReady) {
    return <div>Loading...</div>;
  }

  /**
   * handleSubmit - Function to trigger form submition on update
   * 
   * @param {*} e - event obj of type ANY
   * @returns : Updates jsx form submition elemnts
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handling Update Info of users profile_info documents");
    //setformError(null);

    /*if (!NameUpdate) {
      setformError("Please enter your first & last name.");
      return;
    }

    if (!LocationUpdate) {
      setformError("Please enter your business's location/address.");
      return;
    }

    if (!ProfessionNameUpdate) {
      setformError("Please enter your professions title");
      return;
    }

    if (!BusinessNameUpdate) {
      setformError("Please enter your business's name/title.");
      return;
    }

    if (!linkChangeUpdate) {
      setformError("Please linkChange on Home for social_media_links");
      return;
    }

    // user obj that created project obj
    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    // object that contains business card form info
    const project_updated = {
      legal_name: NameUpdate,
      work_email: EmailUpdate,
      location: LocationUpdate,
      name_of_profession: ProfessionNameUpdate,
      name_business: BusinessNameUpdate,
      phone_num: PhoneNumUpdate,
      social_media_link: linkChangeUpdate,
      link_tree_link: LinktreeUpdate,
      created_by: createdBy,
    };

    console.log(
      NameUpdate,
      EmailUpdate,
      LocationUpdate,
      ProfessionNameUpdate,
      BusinessNameUpdate,
      PhoneNumUpdate,
      linkChangeUpdate,
      LinktreeUpdate,
      createdBy
    );
    console.log("project object: ", project_updated);

    UpdateProfileInfo(project_updated);*/

    console.log("New Info!");

    navigate("/");
  };

  const handleFileChange = (e) => {
    console.log("Event object:", e);
    console.log("File selected:", e.target.files);
    console.log("File[0] selected:", e.target.files[0]);
    setMind_File(null);
    let selected = e.target.files[0];
    console.log(selected);

    if (!selected) {
      setMind_File(null);
      //setformError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setMind_File(null);
      //setformError("Selected file must be an image");
      return;
    }
    if (!selected.size > 100000) {
      setMind_File(null);
      //setformError("Image file size must be less than 100kb");
      return;
    }

    setMind_File(selected);
    //setformError(null);

    console.log("Image target updated");
    console.log("mindFile in Home.jsx: ", mindFileUpdate);
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
                <Upload listType="picture-card" action="/upload.do">
                  <div
                    style={{
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: "2px dashed #d9d9d9",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        type="file"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          opacity: 0,
                        }}
                        onChange={handleFileChange}
                      />
                      <PlusOutlined style={{ fontSize: "20px" }} />
                      <div style={{ marginTop: "2px" }}>Upload</div>
                    </label>
                  </div>
                </Upload>
                {/*formError && (
                  <div className="error"> formError: {formError}</div>
                )*/}
              </label>
              <div>
                <button className="btn">Finish Edit</button>
                {/*formError && (
                  <div className="error"> formError: {formError}</div>
                )*/}
              </div>
            </form>
          </Col>
        </Row>
      )}
    </>
  );
}