import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Spin, Typography } from "antd";
import authApi from "api/authApi";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ActiveEmail.scss";
import FPT_logo from "../../../../assets/images/FPT_logo.png";

export default function AuthVerifyEmail() {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#FFFFFF",
      }}
      spin
    />
  );
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const handleActiveEmailClick = async () => {
    try {
      setLoading(true);
      await authApi.verifyEmail(params.accessToken);
      console.log("success");
      Modal.success({
        title: "Successful",
        content: "Your email was activated successfully",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } catch (error) {
      console.log("error");

      Modal.error({
        title: "Fail",
        content: "This link was expire",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="ActiveEmail">
      <Form
        className="Form"
        autoComplete="off"
        onFinish={handleActiveEmailClick}
      >
        <Link to={"/"}>
          <div className="goBack">
            <img
              src={FPT_logo}
              alt="Go back"
              style={{ width: "40px", height: "25px" }}
            />
          </div>
        </Link>
        <Form.Item>
          <Typography.Title level={3} className="header">
            Active Email
          </Typography.Title>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" className="button">
            <span>Active</span>
            {loading && (
              <div className="Loading">{<Spin indicator={antIcon} />}</div>
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
