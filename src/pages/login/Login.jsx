import styles from './Login.module.css';
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Row, Col } from 'antd';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const { login, error, isPending } = useLogin();
    const { login, error } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
        console.log("Begin handleSubmit after login");
        console.log("After login: ", email, password);
        console.log("Success LOGIN. Firebase response???");
    }

    return (
        <Row gutter={0} justify="center" align="middle" className={styles['login-form']}>
            <Col span={24} xs={24} sm={24} md={24}>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <label>
                        <span>email:</span>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    </label>

                    <label>
                        <span>password:</span>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </label>
                    <button className="btn">Login</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </Col>
        </Row>
    )
    /*{!isPending && <button className='btn'>Login</button>}
    {isPending && <button className='btn' disabled>loading</button>}*/
}