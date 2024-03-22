// Home.jsx 

import { useAuthContext } from '../../hooks/useAuthContext';
import { useProfileInfo } from '../../hooks/useProfileInfo';
import { useFirestore } from '../../hooks/useFirestore';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Row, Col, Button, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import SocialMediaTree from './SocialMediaTree';

//styles
import styles from './Home.module.css';

/**
 * Home - It's actually the Build area, the form that fills
 * the AR-Card's personal info
 * 
 * @returns : jsx form element
 */

export default function Home() {
    console.log("I'm Home. In Profile.")

    //strings
    const [Name, setName] = useState('');
    const [LinktreeLink, setLinktree] = useState('');
    const [WorkEmail, setWorkEmail] = useState('');
    const [Location, setLocation] = useState('');
    const [NameProfession, setNameProfession] = useState('');
    const [NameBusiness, setNameBusiness] = useState('');
    const [linkChange, setLinkChange] = useState({});

    //string of nums
    const [PhoneNum, setPhoneNum] = useState('');

    //bools
    const [refreshed, setRefreshed] = useState(false);
   
    //picture files
    const [mindFile, setMindFile] = useState(null);

    //form errors
    const [formError, setformError] = useState<string | null>(null);
    const [_, setMindFileError] = useState<string | null>(null);

    //component states & function holders
    const { response } = useFirestore('profile_info');
    const { authIsReady, user} = useAuthContext();
    const { profileInfo, MindFile, error } = useProfileInfo();
    const navigate = useNavigate();

    /**
     * handleRefresh - Refreshes the page
     */
    const handleRefresh = () => {
        setRefreshed(true);
        window.location.reload();
    }

    /**
     * handleSubmit - Function that triggers form submition
     *  
     * @param {*} e - event obj of type ANY
     * @returns : Takes new profile_info document
     */
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        console.log("Handle Profile Info");
        console.log("e type: ", typeof e);
        setformError(null);

        if (!Name) {
            setformError("Please enter your first & last name.");
            return;
        }

        if (!Location) {
            setformError("Please enter your business's location/address.");
            return;
        }

        if (!NameProfession) {
            setformError("Please enter your professions title");
            return;
        }

        if (!NameBusiness) {
            setformError("Please enter your business's name/title.");
            return;
        }

        if (!linkChange) {
            setformError("Please linkChange on Home for social_media_links");
            return;
        }

        // user?.obj that created project obj
        const createdBy = {
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            id: user?.uid
        }

        // object that contains business card form info
        const project = {
            legal_name: Name,
            work_email: WorkEmail,
            location: Location,
            name_of_profession: NameProfession,
            name_business: NameBusiness,
            phone_num: PhoneNum,
            social_media_link: linkChange,
            link_tree_link: LinktreeLink,
            created_by: createdBy
        }

        console.log(Name, WorkEmail, Location, NameProfession, NameBusiness, PhoneNum, linkChange, LinktreeLink, createdBy);
        console.log("project object: ", project);

        profileInfo(project);

        if (!response.error) {
            console.log("history has been pushed to homepage");
            navigate('/');
        }

        console.log("New Info!");
    }

    /**
     * handleFileChange - Function that stores 
     * Mind Image Target in /mind at Firebase Storage services
     * 
     * @param {*} e - event obj of type ANY
     * @returns : Image Target to then be converted to .mind file
     */
    const handleFileChange = (e:any) => {
        setMindFile(null);
        let selected = e.target.files[0];
        console.log(selected);

        if (!selected) {
          setMindFile(null);
          setMindFileError("Please select a file");
          return;
        }
        if (!selected.type.includes('image')) {
          setMindFile(null);
          setMindFileError("Selected file must be an image");
          return;
        }
        if (!selected.size > 100000) {
            setMindFile(null);
            setMindFileError('Image file size must be less than 100kb');
            return;
        }

        setMindFile(selected);
        setMindFileError(null);

        console.log('Image target updated');
        console.log("mindFile in Home.jsx: ", mindFile);
        MindFile(selected);
    }

    console.log("User pic: ", user?.photoURL);
    console.log("User displayName: ", user?.displayName);

    //Check user authorization
    if (!authIsReady) {
        return <div>Loading...</div>;
    }

    //Check for existence of user?.profile picture
    if (!user?.photoURL) {
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

    //Refresh page
    if (refreshed) {
        return <Link to="/home"/>;
    } 

    // Build Form JSX elemets
    return (
      <>
        {user  && authIsReady && user?.photoURL && (
          <Row
            gutter={0}
            justify="center"
            align="middle"
            className={styles["fill-form"]}
          >
            <Col span={24} xs={24} sm={24} md={24}>
              <div className={styles.profile}>
                <img
                  className={styles.profilePicture}
                  src={user?.photoURL}
                  alt="Pic"
                />
                <h2>{user?.displayName}'s Profile</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Name (First & Last):</span>
                  <input
                    required
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={Name}
                  />
                </label>
                <label>
                  <span>
                    Work email (Optional: e-mail related to Business Card Info):
                  </span>
                  <input
                    type="text"
                    onChange={(e) => setWorkEmail(e.target.value)}
                    value={WorkEmail}
                  />
                </label>
                <label>
                  <span>Name of business:</span>
                  <input
                    required
                    type="text"
                    onChange={(e) => setNameBusiness(e.target.value)}
                    value={NameBusiness}
                  />
                </label>
                <label>
                  <span>Location of business:</span>
                  <input
                    required
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    value={Location}
                  />
                </label>
                <label>
                  <span>Name of profession:</span>
                  <input
                    required
                    type="text"
                    onChange={(e) => setNameProfession(e.target.value)}
                    value={NameProfession}
                  />
                </label>
                <label>
                  <span>Phone or cell work number (Optional):</span>
                  <input
                    type="text"
                    onChange={(e) => setPhoneNum(e.target.value)}
                    value={PhoneNum}
                  />
                </label>
                <label>
                  <SocialMediaTree onLinkInputsChange={setLinkChange} />
                </label>
                <span>AR-BusinessCard picture:</span>
                <input required type="file" onChange={handleFileChange} />
                <label>
                  <h3>
                    Linktree is suggested in case {user?.displayName} has more
                    than 4 social media links to share
                  </h3>
                  <span>Linktree (Optional):</span>
                  <input
                    type="text"
                    onChange={(e) => setLinktree(e.target.value)}
                    value={LinktreeLink}
                  />
                </label>
                <div>
                  <button className="btn">Begin AR Business Card</button>
                  {error && <div className="error">error: {error}</div>}
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
