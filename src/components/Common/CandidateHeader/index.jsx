import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Space } from "antd";
// import { useDispatch } from "react-redux";
import LoginBox from "./LoginBox";

import { Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import Layout, { Content } from "antd/es/layout/layout";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CandidateHeader.scss";

const { Title } = Typography;
export default function MyHeader(props) {
  const { role, currentUser, handleLogoutClick } = props;
  const navigate = useNavigate();
  const navigateHome = useCallback(() => {
    navigate("");
  }, [navigate]);

  return (
    <Layout.Header className="CandidateHeader">
      <Layout className="MyHeader container">
        <Sider
          className="sider"
          collapsedWidth={0}
          breakpoint="md"
          trigger={null}
        >
          {role === "candidate" && (
            <Space
              size={"middle"}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
            >
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
            </Space>
          )}
        </Sider>
        <Content className="content">
          <Row style={{ height: "100%" }}>
            <Col
              xs={18}
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {role === "candidate" && (
                <Space size={"large"}>
                  <Link to={"/"}>
                    <Title level={5} disabled={true} className="title">
                      Recruitment
                    </Title>
                  </Link>
                  <Link to={"events"}>
                    <Title level={5} disabled={true} className="title">
                      Events
                    </Title>
                  </Link>
                </Space>
              )}
            </Col>
            <Col
              xs={6}
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <LoginBox
                role={role}
                currentUser={currentUser}
                handleLogoutClick={handleLogoutClick}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout.Header>
  );
}
