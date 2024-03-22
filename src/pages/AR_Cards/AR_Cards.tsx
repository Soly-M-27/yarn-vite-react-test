//import AR_CardComments from './AR_CardComments';
//import { useDocument } from '../../hooks/useDocument';
//import { useParams } from 'react-router-dom';
import AR_CardSummary from './AR_CardSummary';
import { Col, Row } from 'antd';
import { useCollection } from '../../hooks/useCollection';

//styles
// import ...

export default function AR_Cards() {

    //const { id } = useParams();
    //const { error, document } = useDocument('profile_info', id);
    const { documents: AR_info } = useCollection(
      "profile_info",
      ["uid", "==", user.uid],
      ["createdAt", "desc"]
    );

    /*if (error) {
        return <div className='error'>{error}</div>
    }*/

    if (!AR_info) {
        return <div className='loading'>Loading....</div>
    }

    return (
        <>
            <Row gutter={0} justify="center" className={styles.navbar}>
                <Col span={24} xs={24} sm={24} md={24}>
                    <div>
                        {AR_info &&
                            <div className='project-details'>
                                <AR_CardSummary card={AR_info} />
                            </div>}
                    </div>
                </Col>
            </Row>
        </>
    )
    /*<AR_CardComments card={document} />*/
}