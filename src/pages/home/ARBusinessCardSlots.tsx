import { useFirestore } from '../../hooks/useFirestore';
import { Row, Col } from 'antd';
import { useAuthContext } from '../../hooks/useAuthContext';
import { EditOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

//styles
import styles from './ARBC.module.css';

//antd elements: https://ant.design/components/card
const { Meta } = Card;

/**
 * BusinessCardSlot - Display the array of documents each user creates from Home.jsx (the build area)
 * 
 * @param {*} param0 - parameter that takes documents from Dashboard where useCollection fetches said documents
 * @returns : jsx elements for Business Card square
 */
export default function BusinessCardSlot ({ BusinessCard }: any) {
 
  //component states & function holders
  const navigate = useNavigate();
  const { deleteDocument, response } = useFirestore('profile_info');
  console.log("response from AR_BusinessCardSlots.js: ", response);
 
  const { user, authIsReady } = useAuthContext();
  //const { loading } = Sidebar();
  const  loading = false;
 
  const userID = user?.uid;

  console.log("typeof userID in ARBusinessCardSlots.jsx: ", typeof userID);
  console.log("userID in ARBusinessCardSlots.jsx: ", userID);

  /**
   * handleEditClick - function that sends the user to the edit page to update old info,
   * using the id that identifies the document, not the id of the user (user id is contained
   * in all documents but each document does have its own id)
   * 
   * @param {*} id - id of the card being edited. Try to use this id to compare in 
   * EditUpdatePage.jsx whether the documents id matches the id to be edited/updated
   */
  const handleEditClick = (id: any) => { //Unapplied useDocument.jsx file may help with some of these needs
    navigate(`/edit/${id}`);
  }

  /**
   * handleClick - function to handle document deletion based on documents id (card.id)
   * 
   * @param {*} id - id to be deleted by Firebase services
   * @returns : deleted message confirmation on console
   */
  const handleClick = async (id: any) => {
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

  //Chekc user authorization
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
  
  //Document checkers. DO NOT REMOVE THEM, OR DOCUMENTS WILL PASS EMPTY
  //Check documents
  if (!BusinessCard || BusinessCard.length === 0) {
    console.log("Documents NOT passed to BusinessCard: ", BusinessCard);
  } else {
    console.log("Documents passed to BusinessCard: ", BusinessCard);
  }

  //Check if documents is an array
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
                    <div key={card.created_by.id}>
                      <h4>{card.legal_name}'s AR-Card</h4>
                      <p> {card.name_of_profession} </p>
                      <p> Business Name: {card.name_business} </p>
                      <p> Location: {card.location} </p>
                      <p> e-mail: {card.work_email} </p>
                      <p>
                        {" "}
                        Linktree:{" "}
                        <a href={card.link_tree_link}>
                          {" "}
                          {card.link_tree_link}{" "}
                        </a>
                      </p>
                      <p> Phone Num: {card.phone_num} </p>
                      {Object.keys(card.social_media_link).map((key) => (
                        <p key={key}>
                          <li>
                            link:{" "}
                            <a href={card.social_media_link[key]}>
                              {" "}
                              {card.social_media_link[key]}{" "}
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
