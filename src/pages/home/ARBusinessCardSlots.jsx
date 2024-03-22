import { useFirestore } from '../../hooks/useFirestore';
import { Row, Col } from 'antd';
import { useAuthContext } from '../../hooks/useAuthContext';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import Sidebar from '../../components/Sidebar'
//import EditUpdatePage from '../home/EditUpdatePage'
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
export default function BusinessCardSlot ({ BusinessCard }) {
  //component states & function holders
  const navigate = useNavigate();
  const { deleteDocument, response } = useFirestore("profile_info");
  console.log("response from AR_BusinessCardSlots.js: ", response);

  const { user, authIsReady } = useAuthContext();
  const { loading } = Sidebar();

  const userID = user.uid;

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
  const handleEditClick = (id) => {
    //Unapplied useDocument.jsx file may help with some of these needs
    navigate(`/edit/${id}`);
  };

  /**
   * handleClick - function to handle document deletion based on documents id (card.id)
   *
   * @param {*} id - id to be deleted by Firebase services
   * @returns : deleted message confirmation on console
   */
  const handleClick = async (id) => {
    try {
      if (!id) {
        console.log("No id Found!");
        return;
      }
      console.log("id found in handleClick of ARBusinessCardSlots.jsx:", id);

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
              <Card
                style={{ width: "300px", marginTop: "16px" }}
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
        <Row gutter={0} justify="center" align="middle">
          <Col span={24} xs={24} sm={24} md={24}>
            <div className={styles["flex-container"]}>
              {/*<p className={styles["flex-item"]}>Name0</p>
          <p className={styles["flex-item"]}>Name1</p>
          <p className={styles["flex-item"]}>Name2</p>*/}
              {BusinessCard.length === 0 && (
                <p>No Business Card created yet in Dashboard!</p>
              )}
              {BusinessCard.map((card) => (
                <div>
                  <Card
                    /*style={{ width: "300px", marginTop: "16px" }}*/
                    className={styles["flex-item"]}
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditClick(card.id)}
                      />,
                    ]}
                  >
                  <div className={styles["flex-x-delete-button"]}>
                    <button onClick={() => handleClick(card.id)}>x</button>
                  </div>
                    <Skeleton loading={loading} avatar active>
                      <Meta
                        style={{
                          padding: "5px",
                          fontSize: "12px",
                          marginBottom: "20px",
                        }}
                        avatar={<Avatar className={styles["avatar-size"]} src={user.photoURL} />}
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
                      </div>
                    </Skeleton>
                  </Card>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}