import styles from './searchbar.module.css';
import { useState, FormEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'antd';

export default function Searchbar() {

    const [term, setTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/search?q=${term}`);
    }

    return (
        <Row gutter={0} justify="center" className={styles.navbar}>
            <Col span={24} xs={24} sm={24} md={24}>
                <div className={styles['searchbar']}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='search'>Search:</label>
                        <input
                            type="text"
                            id="search"
                            onChange={(e) => setTerm(e.target.value)}
                            required
                        />
                    </form>
                </div>
            </Col>
        </Row>
    )
}
