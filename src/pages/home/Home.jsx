import styles from './Home.module.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useProfileInfo } from '../../hooks/useProfileInfo';
import { useFirestore } from '../../hooks/useFirestore';
//import { useCollection } from '../../hooks/useCollection';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Row, Col, Button, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import SocialMediaTree from './SocialMediaTree';
//import AR_BusinessCardSlots from './AR_BusinessCardSlots';

export default function Home() {
    console.log("I'm Home. In Profile.")

    const navigate = useNavigate();

    const [Name, setName] = useState('');
    const [LinktreeLink, setLinktree] = useState('');
    const [WorkEmail, setWorkEmail] = useState('');
    const [Location, setLocation] = useState('');
    const [NameProfession, setNameProfession] = useState('');
    const [NameBusiness, setNameBusiness] = useState('');
    const [PhoneNum, setPhoneNum] = useState('');
    const [refreshed, setRefreshed] = useState(false);
    const [formError, setformError] = useState(null);
    const [linkChange, setLinkChange] = useState({});

    const { response } = useFirestore('profile_info');
    const { authIsReady, user } = useAuthContext();
    const { profileInfo, error } = useProfileInfo();
    //const { addDocument, response } = useFirestore('profile_info');
    //const { errorC } = useCollection();
        /*'profile_info',
        ["uid", "==", user.uid],
        ["createdAt", "desc"]*/

    const handleRefresh = () => {
        setRefreshed(true);
        window.location.reload();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Handle Profile Info");
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

        // user obj that created project obj
        const createdBy = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid
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

        //setNewProject(project);
        profileInfo(project);
        //await addDocument(project);

        if (!response.error) {
            console.log("history has been pushed to homepage");
            navigate('/');
        }

        console.log("New Info!");
    }

    console.log("User pic: ", user.photoURL);
    console.log("User displayName: ", user.displayName);

    if (!authIsReady) {
        return <div>Loading...</div>;
    }

    if (!user.photoURL) {
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
        return <Link to="/home"/>;
    } 

    return (
        <>
            {user && authIsReady && user.photoURL && (
                <Row gutter={0} justify="center" align="middle" className={styles['fill-form']}>
                    <Col span={24} xs={24} sm={24} md={24}>
                        <div className={styles.profile}>
                           <img className={styles.profilePicture} src={user.photoURL} alt="Pic"/> 
                           <h2>{user.displayName}'s Profile</h2>
                        </div>
                        <form
                            onSubmit={handleSubmit}>
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
                                <span>Work email (Optional: e-mail related to Business Card Info):</span>
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
                            <label>
                                <h3>Linktree is suggested in case {user.displayName} has more than 4 social media links to share</h3>
                                <span>Linktree (Optional):</span> 
                                <input
                                    type="text"
                                    onChange={(e) => setLinktree(e.target.value)}
                                    value={LinktreeLink}
                                />
                            </label>
                            <div>
                                <button className='btn'>Begin AR Business Card</button>
                                {error && <div className="error">error: {error}</div>}
                                {formError && <div className="error"> formError: {formError}</div>}
                            </div>
                        </form>
                    </Col>
                </Row>
            )}
        </>
    )
    //{errorC && <p className='error'>{errorC}</p>}
    //{BusinessCards && <AR_BusinessCardSlots BusinessCard={BusinessCards} />}
}