import { Col, Dropdown, Row, Space, Typography } from "antd";
import imgtemp from "assets/images/avatar-temp.jpg";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginBox.scss";
import { useSelector } from "react-redux";

const { Title } = Typography;

export default function LoginBox(props) {
  const { currentUser, handleLogoutClick } = props;
  const loading = useSelector((state) => state.candidate.loading);

  // Navigate
  const navigate = useNavigate();

  const items = useMemo(() => {
    return [
      {
        label: <Link to={"info"}>Account</Link>,
        key: "0",
      },
      {
        label: <Link to={"manage-resumes"}>Resumes</Link>,
        key: "1",
      },
      {
        label: <Link to={"history"}>History</Link>,
        key: "interview",
      },
      {
        type: "divider",
      },
      {
        label: <Link onClick={handleLogoutClick}>Log out</Link>,
        key: "3",
      },
    ];
  }, [handleLogoutClick]);
  return (
    <div className="LoginBox">
      {(currentUser && currentUser.email) ? (
        <Row style={{ width: "100%" }}>
          <Col xs={24} lg={0}>
            <Dropdown
            disabled={loading}
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <div className="avatar-img">
                <div
                  className="avatar-view"
                  style={{ background: `url(${currentUser.linkAvt ? currentUser.linkAvt : "https://sangtao.sawaco.com.vn/wwwimages/Avatar/defaultavatar.png"}) center center/cover`, height: "100%" }}
                ></div>
              </div>
            </Dropdown>
          </Col>

          <Col xs={0} lg={24}>
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <Space
                size={"middle"}
                style={{
                  justifyContent: "center",
                  cursor: "pointer",
                  marginLeft: "2rem",
                }}
              >
                <div className="avatar-img">
                  <div
                    className="avatar-view"
                    style={{ background: `url(${currentUser.linkAvt ? currentUser.linkAvt : "https://sangtao.sawaco.com.vn/wwwimages/Avatar/defaultavatar.png"}) center center/cover`, height: "100%" }}
                  ></div>
                </div>
                <Title disabled={true} level={5} className="title">
                  {currentUser.email}
                </Title>
              </Space>
            </Dropdown>
          </Col>
        </Row>
      ) : (
        <Space size={"large"}>
          <Link to={"/signup"}>
            <Title level={5} disabled={true} className="title">
              Sign up
            </Title>
          </Link>
          <Title
            style={{ color: "#d9dadc", cursor: "unset", margin: 0 }}
            level={4}
            disabled={true}
          >
            |
          </Title>
          <Title
            level={5}
            disabled={true}
            className="title"
            onClick={() => {
              return navigate("/login", {
                state: {
                  urlToLoad: window.location.href,
                },
              });
            }}
          >
            Log in
          </Title>
        </Space>
      )}
    </div>
  );
}
