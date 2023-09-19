import {
  DeleteFilled,
  PlusSquareOutlined,
  UploadOutlined,
  EyeTwoTone,
  EditTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Upload,
  message,
  Card,
} from "antd";
import { useState, useEffect } from "react";
import "./managecv.scss";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { candidateActions } from "features/candidate/candidateSlice";
import { useNavigate } from "react-router-dom";

export default function CandidateResume() {
  const notification = useSelector((state) => state.candidate.notification);
  const resumes = useSelector((state) => state.candidate.resumes);
  const loading = useSelector((state) => state.candidate.loading);
  const authStatus = useSelector((state) => state.auth.status);

  const accessToken = localStorage.getItem("accessToken");
  const currentRole = localStorage.getItem("currentRole");

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || (accessToken && !currentRole)) {
      navigate("/login");
    }
  }, [authStatus, currentRole, accessToken, navigate]);

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", fileList[0]);
    dispatch(candidateActions.createResumeRequest(formData));
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const handleDeleteCVOK = (cvID) => {
    dispatch(candidateActions.deleteResumeRequest(cvID));
  };

  const handleDeleteCVCancel = () => {
    message.error("Clicked on No");
  };

  useEffect(() => {
    setUploading(false);

    if (notification.type === "success") setFileList([]);

    if (notification.type)
      messageApi.open({
        type: notification.type,
        content: notification.message,
        style: {
          marginTop: "4rem",
        },
      });
    dispatch(candidateActions.resetNotification());
  }, [dispatch, messageApi, notification]);

  const columns = [
    {
      title: "Resume name",
      dataIndex: "fileName",
      key: "fileName",
      width: "30%",
      align: "center",
      render: (text, record) => {
        if (text.endsWith(".pdf")) {
          let result = text.slice(0, -4);
          return result;
        }
        return text;
      },
    },
    {
      title: "Date created",
      dataIndex: "creatdDate",
      key: "creatdDate",
      width: "auto",
      defaultSortOrder: "descend",
      align: "center",
      sorter: (a, b) => new Date(a.creatdDate) - new Date(b.creatdDate),
      render: (text, record) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const date = new Date(record.creatdDate);
        return (
          <>
            {`${
              days[date.getDay()]
            } ${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      align: "center",
      render: (text, record) => (
        <Space>
          <Tooltip title="View CV" placement="top">
            <Link to={`/view-resume?_resumeID=${record.id}`} target="_blank">
              <Button type="text" icon={<EyeTwoTone />} />
            </Link>
          </Tooltip>
          <Tooltip title="Edit CV" placement="top">
            <Link to={`/edit-resume/${record.id}`}>
              <Button type="text" icon={<EditTwoTone />} />
            </Link>
          </Tooltip>
          <Tooltip title="Delete CV" placement="top">
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDeleteCVOK(record.id)}
              onCancel={handleDeleteCVCancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="text" icon={<DeleteFilled />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="ManageCV container">
      {contextHolder}
      <Space className="upload-crate-wrap">
        <Link to="/create-resume">
          <Button type="primary" icon={<PlusSquareOutlined />}>
            Create CV
          </Button>
        </Link>

        <Upload {...props} accept=".pdf">
          <Button icon={<UploadOutlined />}>Upload CV</Button>
        </Upload>

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      </Space>
      <Card className="ManageResume" title="Manage Resumes">
        <Table
          loading={loading}
          rowKey={(data) => data.id}
          pagination={{ pageSize: 8 }}
          columns={columns}
          dataSource={resumes}
        />
      </Card>
    </div>
  );
}
