import { useFirestore } from '../../hooks/useFirestore';
import styles from './ARBC.module.css';
import { Row, Col } from 'antd';
import { useAuthContext } from '../../hooks/useAuthContext';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import Sidebar from '../../components/Sidebar'
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

export default function BusinessCardSlot ({ BusinessCard }) {
  const navigate = useNavigate();
  const { deleteDocument, response } = useFirestore('profile_info');
  console.log("response from AR_BusinessCardSlots.js: ", response);
  const { user, authIsReady } = useAuthContext();
  const { loading } = Sidebar();
  const userID = user.uid;

  console.log("typeof userID in ARBusinessCardSlots.jsx: ", typeof userID);
  console.log("userID in ARBusinessCardSlots.jsx: ", userID);

  if (!BusinessCard || BusinessCard.length === 0) {
    console.log("Documents NOT passed to BusinessCard: ", BusinessCard);
  } else {
    console.log("Documents passed to BusinessCard: ", BusinessCard);
  }

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
  }

  const handleClick = async (id) => {
    try {
      if (!id) {
        console.log("No id Found!");
        return;
      }
      console.log(
        "id found in handleClick of ARBusinessCardSlots.jsx:",
        id
      );

      deleteDocument(id);
      console.log("Document deleted successfully!");

    } catch (err) {
      console.log("Error deleting document: ", err);
    }
  };

  if (!authIsReady) {
    return (
      <div>
        {!authIsReady && (
          <Row gutter={0} justify="center" align="middle">
            <Col span={24} xs={24} sm={24} md={24}>
              <Card style={{ width: "300px", marginTop: "16px" }}
                loading={loading}
              >
                <Meta
                  avatar={
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                  }
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    );
  }

  if (!BusinessCard || !Array.isArray(BusinessCard)) {
    return <p>No Business Card created yet!</p>;
  }

  return (
    <>
      {user && authIsReady && (
        <Row
          gutter={0}
          justify="center"
          align="middle"
          className={styles["login-form"]}
        >
          <Col span={24} xs={24} sm={24} md={24}>
            <div>
              {BusinessCard.length === 0 && (
                <p>No Business Card created yet in Dashboard!</p>
              )}
              {BusinessCard.map((card) => (
                <Card
                  style={{ width: "300px", marginTop: "16px" }}
                  actions={[<EditOutlined key="edit" onClick={() => handleEditClick(card.id)} />]}
                >
                  <Skeleton loading={loading} avatar active>
                    <Meta
                      style={{ padding: "20px" }}
                      avatar={<Avatar src={user.photoURL} />}
                      title={user.displayName}
                      description="Augmented Reality Experience"
                    />
                    <div key={card.CreatedBy.id}>
                      <h4>{card.Name}'s AR-Card</h4>
                      <p> {card.NameOfProfession} </p>
                      <p> Business Name: {card.NameBusiness} </p>
                      <p> Location: {card.Location} </p>
                      <p> e-mail: {card.WorkEmail} </p>
                      <p>
                        {" "}
                        Linktree:{" "}
                        <a href={card.Link_Tree_Link}>
                          {" "}
                          {card.Link_Tree_Link}{" "}
                        </a>
                      </p>
                      <p> Phone Num: {card.PhoneNum} </p>
                      {Object.keys(card.Social_Media_Links).map((key) => (
                        <p key={key}>
                          <li>
                            link:{" "}
                            <a href={card.Social_Media_Links[key]}>
                              {" "}
                              {card.Social_Media_Links[key]}{" "}
                            </a>
                          </li>
                        </p>
                      ))}
                      <p> Card.id: {card.id} </p>
                      <button onClick={() => handleClick(card.id)}>x</button>
                    </div>
                  </Skeleton>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}