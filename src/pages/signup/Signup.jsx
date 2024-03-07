import styles from './Signup.module.css';
import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import { Col, Row } from 'antd';

export default function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailError, setThumbnailError] = useState(null);
    // const { signup, isPending, error } = useSignup();
    const { error, signup } = useSignup();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password, displayName);
        signup(email, password, displayName, thumbnail);
        console.log("Signed up??");
    }

    const handleFileChange = (e) => {
        setThumbnail(null);
        let selected = e.target.files[0];
        console.log(selected);

        if (!selected) {
            setThumbnailError('Please select a file');
        }
        if (!selected.type.includes('image')) {
            setThumbnailError('Selected file must be an image');
        }
        if (!selected.size > 100000) {
            setThumbnailError('Image file size must be less than 100kb');
        }
        setThumbnailError(null);
        setThumbnail(selected);
        console.log('Thumbnail updated');
    }

    return (
        <Row gutter={0} justify="center" align="middle" className={styles['signup-form']}>
            <Col span={24} xs={24} sm={24} md={24}>
                <form
                    onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    <label>
                        <span>email:</span>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </label>
                    <label>
                        <span>password:</span>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </label>
                    <label>
                        <span>display name:</span>
                        <input
                            type="text"
                            onChange={(e) => setDisplayName(e.target.value)}
                            value={displayName}
                        />
                    </label>
                    <label>
                        <span>profile picture:</span>
                        <input
                            required
                            type="file"
                            onChange={handleFileChange}
                        />
                        {thumbnailError && <div className="error">{thumbnailError}</div>}
                    </label>
                    <button className='btn'>Sign Up</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </Col>
        </Row>
    )
    /*
     {!isPending && <button className="btn">Sign Up</button>}
     {isPending && <button className='btn' disabled>loading</button>}*/

}