//EditUpdatePage.jsx

import { useAuthContext } from '../../hooks/useAuthContext';
//import { useFirestore } from '../../hooks/useFirestore';`;
import { useState } from 'react';
import { Row, Col, Button, Input, Upload, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProfileInfo } from '../../hooks/useProfileInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { useCollection } from '../../hooks/useCollection';
import SocialMediaTree from './SocialMediaTree';

//styles
import styles from './Home.module.css';

/**
 * EditUpdatepPage - Update already existing document and its fields
 * 
 * @returns : JSX elements
 */
export default function EditUpdatePage() {
  console.log("I'm in EditUpdatePage.");
  
  //component states & function holders
  const { authIsReady, user } = useAuthContext();
  const { MindFile, UpdateProfileInfo } = useProfileInfo();
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    console.log("No id: ", id);
  } else {
    console.log("Yes id: ", id);
  }
  const { documents, errorC } = useCollection(
    "profile_info",
    user ? ["uid", "==", user.uid] : [], // An array being passed as a function parameter. We're saying only fetch the books where the uid property of the book is equal to the uid of the user
    ["createdAt", "desc"],
    user.uid //Pass the user's UID directly
  );

  //tests
  const [mindFileUpdate, setMind_File] = useState(null);
 
  //strings
  
  //Will uncomment after figuring out how new state values with be updated in:
  //https://firebase.google.com/docs/firestore/manage-data/add-data#web-modular-api_8

  const [NameUpdate, setName] = useState("");
  const [LinktreeUpdate, setLinktree] = useState("");
  const [EmailUpdate, setWorkEmail] = useState("");
  const [LocationUpdate, setLocation] = useState("");
  const [ProfessionNameUpdate, setNameProfession] = useState("");
  const [BusinessNameUpdate, setNameBusiness] = useState("");
  const [PhoneNumUpdate, setPhoneNum] = useState("");
  const [linkChangeUpdate, setLinkChange] = useState({});
  
  //bool
  //const [refreshed, setRefreshed] = useState(false);
  
  //form errors
   const [formError, setformError] = useState(null);

  /**
   * handleSubmit - Function to trigger form submition on update
   * 
   * @param {*} e - event obj of type ANY
   * @returns : Updates jsx form submition elemnts
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handling Update Info of users profile_info documents");
    setformError(null);

    if (!NameUpdate) {
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

    UpdateProfileInfo(project_updated, id);

    console.log("New Info!");

    navigate("/");
  };

  /**
   * handleFileChange - function that handles mindFile Image
   * (this function takes the selected onChange file to the MindFile
   * function in useProfileInfo.jsx. MindFile function will have to be
   * re-written later to add the .mind compiler like we did before)
   * 
   * @param {*} e - event obj of type ANY (it should be an image file)
   * @returns : mindImage to Firebase Storage via MindFile
   */
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

  //Document checkers. DO NOT REMOVE THEM, OR DOCUMENTS WILL PASS EMPTY
  //Check documents
  if (!documents || documents.length === 0) {
    console.log("Documents NOT passed to BusinessCard: ", documents);
    console.log("errorC: ", errorC);
  } else {
    console.log("Documents passed to BusinessCard: ", documents);
  }

  //Check if documents is an array
  if (!documents || !Array.isArray(documents)) {
    return <p>No Business Card created yet!</p>;
  }

  //Check user authorization
  if (!authIsReady) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user && authIsReady && user.photoURL && documents && (
        <Row
          gutter={0}
          justify="center"
          align="middle"
          className={styles["flex-container-center"]}
        >
          <Col span={24} xs={24} sm={24} md={24}>
            <form onSubmit={handleSubmit}>
              <div className={styles.profile}>
                <img
                  className={styles.profilePicture}
                  src={user.photoURL}
                  alt="Pic"
                />
                <h2>{user.displayName}'s Card Profile</h2>
                {errorC && <p className="error">{errorC}</p>}
              </div>
              <div>
                {documents.length === 0 && (
                  <p>No Business Card created yet in EditUpdatePage!</p>
                )}
                {documents &&
                  Array.isArray(documents) &&
                  documents.map((card) => (
                    <div key={card.CreatedBy.id}>
                      {id === card.id && (
                        <>
                            <label>
                              <span>Name (First & Last):</span>
                              <input
                                required
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={NameUpdate}
                                default={card.Name}
                              />
                            </label>
                            <label>
                              <span>
                                Work email (Optional: e-mail related to Business
                                Card Info):
                              </span>
                              <input
                                type="text"
                                onChange={(e) => setWorkEmail(e.target.value)}
                                value={EmailUpdate}
                                default={card.WorkEmail}
                              />
                            </label>
                            <label>
                              <span>Name of business:</span>
                              <input
                                required
                                type="text"
                                onChange={(e) =>
                                  setNameBusiness(e.target.value)
                                }
                                value={BusinessNameUpdate}
                                default={card.NameBusiness}
                              />
                            </label>
                            <label>
                              <span>Location of business:</span>
                              <input
                                required
                                type="text"
                                onChange={(e) => setLocation(e.target.value)}
                                value={LocationUpdate}
                                default={card.Location}
                              />
                            </label>
                            <label>
                              <span>Name of profession:</span>
                              <input
                                required
                                type="text"
                                onChange={(e) =>
                                  setNameProfession(e.target.value)
                                }
                                value={ProfessionNameUpdate}
                                default={card.NameOfProfession}
                              />
                            </label>
                            <label>
                              <span>Phone or cell work number (Optional):</span>
                              <input
                                type="text"
                                onChange={(e) => setPhoneNum(e.target.value)}
                                value={PhoneNumUpdate}
                                default={card.PhoneNum}
                              />
                            </label>
                            <label>
                              <SocialMediaTree
                                onLinkInputsChange={setLinkChange}
                              />
                            </label>
                            <span>AR-BusinessCard picture:</span>
                            <input
                              required
                              type="file"
                              onChange={handleFileChange}
                              default={mindFileUpdate}
                            />
                            <label>
                              <h3>
                                Linktree is suggested in case {user.displayName}{" "}
                                has more than 4 social media links to share
                              </h3>
                              <span>Linktree (Optional):</span>
                              <input
                                type="text"
                                onChange={(e) => setLinktree(e.target.value)}
                                value={LinktreeUpdate}
                                default={card.Link_Tree_Link}
                              />
                            </label>
                        </>
                      )}
                    </div>
                  ))}
              </div>
              <label>
                {/*<Upload listType="picture-card" action="/upload.do">
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
                      </Upload>*/}
                {formError && (
                  <div className="error"> formError: {formError}</div>
                )}
              </label>
              <div className={styles["flex-container"]}>
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