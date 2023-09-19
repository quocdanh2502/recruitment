import {
  ArrowLeftOutlined,
  DownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Typography,
} from "antd";

import authApi from "api/authApi";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authActions, authSelectors } from "../../authSlice";
import "./AuthLogin.scss";
import FPT_logo from "../../../../assets/images/FPT_logo.png";
const items = [
  {
    key: "1",
    label: "Admin",
  },
  {
    key: "2",
    label: "Interviewer",
  },
  {
    key: "3",
    label: "Recruiter",
  },
  {
    key: "4",
    label: "Candidate",
  },
];

export default function AuthLogin() {
  // Location
  const location = useLocation();

  // ----------------------------
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#FFFFFF",
      }}
      spin
    />
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("Candidate");
  const { status } = useSelector(authSelectors);
  const [email, setEmail] = useState();

  const handleOptionSelect = (item) => {
    setSelectedOption(item.label);
  };
  const handleLoginClick = (values) => {
    console.log(values);
    setEmail(values.email);
    dispatch(authActions.login(values));
  };
  const handleResendActiveClick = useCallback(async () => {
    try {
      await authApi.resendActive(email);
      console.log("success");

      Modal.success({
        title: "Send successfully",
        content: "Please check your email to active email !!!",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } catch (error) {
      Modal.error({
        title: "Send fail",
        content: "Please check your email !!!",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    }
  }, [email]);

  // Effect-----------------------
  useEffect(() => {
    if (location.state) {
      let urlToLoad = "";
      let i = 3;
      const dataUrl = location.state.urlToLoad.split("/");
      while (i < dataUrl.length) {
        urlToLoad += `${dataUrl[i]}`;
        if (i !== dataUrl.length - 1) {
          urlToLoad += "/";
        }
        i++;
      }
      localStorage.setItem("urlToLoad", urlToLoad);
    }
    if (status === 200) {
      console.log(location);
      if (selectedOption === "Admin") {
        navigate("/admin");
      } else if (selectedOption === "Candidate") {
        const urlToLoad = localStorage.getItem("urlToLoad");
        localStorage.removeItem("urlToLoad");
        navigate(`/${urlToLoad}`);
      } else if (selectedOption === "Interviewer") {
        navigate("/interviewer");
      } else if (selectedOption === "Recruiter") {
        navigate("/recruiter");
      }
    } else if (status === 400) {
      console.log("email not active");
      dispatch(authActions.logout());

      Modal.confirm({
        title: "Email not active",
        content:
          "Your email is not active. Do you want to resend the verification email?",
        onOk() {
          handleResendActiveClick();
        },
        onCancel() {},
      });
    } else if (status === 401) {
      console.log("password incorrect");
      dispatch(authActions.logout());

      Modal.error({
        title: "Password incorrect",
        content: "Your password is incorrect.",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } else if (status === 404) {
      console.log("email not exist");
      dispatch(authActions.logout());

      Modal.error({
        title: "Email incorrect",
        content: "Your email is incorrect.",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    }
  }, [
    dispatch,
    handleResendActiveClick,
    location.state,
    navigate,
    selectedOption,
    status,
  ]);

  // Return--------------------------------------------
  return (
    <div className="AuthLogin">
      <Form className="form" onFinish={handleLoginClick}>
        <Link to={"/"}>
          <div className="goBack">
            <img
              src={FPT_logo}
              alt="Go back"
              style={{ width: "40px", height: "25px" }}
            />
          </div>
        </Link>
        <Typography.Text level={1} className="header">
          Welcome, <span>{selectedOption}</span>!
        </Typography.Text>
        <Form.Item
          hasFeedback
          name="email"
          style={{ marginTop: "20px" }}
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            { type: "email" },
          ]}
        >
          <Input required bordered className="input" placeholder="Email" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password
            required
            bordered
            className="input"
            placeholder="Password"
          />
        </Form.Item>
        <Link to="/forgot-password">
          <Typography.Text className="link">
            Forgot your password?
          </Typography.Text>
        </Link>
        <Form.Item style={{ marginTop: "20px" }}>
          <Button block type="primary" htmlType="submit" className="button">
            <span>Sign in</span>
            <div className="Loading">
              {status === "pending" && <Spin indicator={antIcon} />}
            </div>
          </Button>
        </Form.Item>
        {selectedOption === "Candidate" && (
          <Link to="/signup" className="link">
            <span className="linkSmall">Don't have an account? </span>
            Sign up
          </Link>
        )}
      </Form>
      <div className="option">
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ["4"],
            onClick: ({ key }) => {
              const selectedItem = items.find((item) => item.key === key);
              handleOptionSelect(selectedItem);
            },
          }}
        >
          <Typography.Link>
            <Space>
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>
    </div>
  );
}
