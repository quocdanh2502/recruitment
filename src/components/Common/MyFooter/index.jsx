import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./MyFooter.scss";

const { Title } = Typography;
export default function MyFooter(props) {
  const navigate = useNavigate();
  const { role } = props;
  const navigateHome = () => {
    navigate("");
  };
  return (
    <div className="MyFooter container">
      {role === "candidate" && (
        <Row>
          <Col xs={0} md={18}>
            <Space size={80} wrap={true} className="content">
              <Title disabled level={5} className="title">
                About Us
              </Title>
              <Title disabled level={5} className="title">  
                Feedback
              </Title>
              <Link to={"signup"}>
                <Title disabled level={5} className="title">
                  Sign Up
                </Title>
              </Link>
              <Title disabled level={5} className="title">
                Contact
              </Title>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Space size={"large"} className="sider">
              <FontAwesomeIcon
                size="2xl"
                icon="fa-brands fa-facebook"
                className="icon"
              />
              <FontAwesomeIcon
                size="2xl"
                icon="fa-brands fa-instagram"
                className="icon"
              />
              <FontAwesomeIcon
                size="2xl"
                icon="fa-brands fa-youtube"
                className="icon"
              />
              <FontAwesomeIcon
                size="2xl"
                icon="fa-brands fa-twitter"
                className="icon"
              />
            </Space>
          </Col>
        </Row>
      )}
      <Row className="footer" justify={"center"} align={"middle"}>
        {role === "candidate" && (
          <>
            <FontAwesomeIcon
              icon="fa-solid fa-blog"
              size="2xl"
              style={{
                fontSize: "2rem",
                margin: "0 0.5rem",
              }}
              className="icon"
              onClick={navigateHome}
            />
            <FontAwesomeIcon
              icon="fa-brands fa-slack"
              size="2xl"
              style={{
                fontSize: "2rem",
                margin: "0 0.5rem",
              }}
              className="icon"
              onClick={navigateHome}
            />
          </>
        )}
      </Row>
    </div>
  );
}
