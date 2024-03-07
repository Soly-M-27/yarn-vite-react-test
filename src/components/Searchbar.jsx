import styles from './Searchbar.module.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'antd';

export default function Searchbar() {

    const [term, setTerm] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/search?q=${term}`);
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
                            onChange={(e) => setTerm(e.target.valeu)}
                            required
                        />
                    </form>
                </div>
            </Col>
        </Row>
    )
}