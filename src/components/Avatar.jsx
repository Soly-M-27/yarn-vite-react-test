// styles
import styles from './Avatar.module.css';
import { Col, Row } from 'antd';

export default function Avatar({ src }) {
  return (
    <Row gutter={0} justify="center" className={styles['avatar']}>
      <Col span={24} xs={24} sm={24} md={24}>
        <div className="avatar">
          <img src={src} alt="user avatar" />
        </div>
      </Col>
    </Row>
  )
}