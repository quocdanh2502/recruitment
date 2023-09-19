import { EyeOutlined, FolderOpenTwoTone } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip, Typography, Spin } from "antd";
import candidateApi from "api/candidateApi";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import "./CandidateInterviewHistory.scss";

export default function CandidateInterviewHistory() {
  const userID = useSelector((state) => state.auth.currentUser.id);
  const navigate = useNavigate();
  const [data, setData] = useState({
    listInterviews: null,
    listAppliedVacancies: null,
  });
  const [loading, setLoading] = useState(true);
  const listPosition = useSelector((state) => state.public.positions);

  const customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);
  const positionFilter =
    listPosition &&
    listPosition.map((item) => {
      return { text: item.name, value: item.name };
    });

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const listAppliedVacancies = await candidateApi.getInterviewHistory();
        // const listInterviews = await candidateApi.getInterviews();
        setData({
          ...data,
          // listInterviews: listInterviews,
          listAppliedVacancies: listAppliedVacancies,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          setData({
            listInterviews: [],
            listAppliedVacancies: [],
          });
        }
        setLoading(false);
      }
    };
    fetchInterview();
  }, [data]);
  function newPage(url) {
    return window.open(url, "_blank");
  }

  const columns = [
    {
      title: "Position",
      key: "position",
      render: (record) => (
        <>
          <Typography.Title level={5}>
            {record.vacancy.position.name}
          </Typography.Title>
        </>
      ),
      filters: positionFilter,
      onFilter: (value, record) =>
        record.vacancy.position.name.indexOf(value) === 0,
      align: "center",
      filterSearch: true,
    },
    {
      title: "Location",
      key: "working_location",
      align: "center",
      render: (record) => (
        <Typography.Title level={5}>
          {record.vacancy.working_location
            ? record.vacancy.working_location.split(":")[0]
            : "NO"}
        </Typography.Title>
      ),
    },
    {
      title: "Interview Date",
      key: "interviewDate",
      align: "center",
      render: (record) => (
        <Typography>
          {record.interviewDatetime !== null
            ? dayjs(record.interviewDatetime.split("T")[0]).format("DD/MM/YYYY")
            : "NO DATA"}
        </Typography>
      ),
      sorter: (a, b) => {
        if (a.interviewDatetime && b.interviewDatetime) {
          return (
            dayjs(a.interviewDatetime.split("T")[0]).format("DD/MM/YYYY") -
            dayjs(b.interviewDatetime.split("T")[0]).format("DD/MM/YYYY")
          );
        } else if (a.interviewDatetime) {
          return 1;
        } else if (b.interviewDatetime) {
          return -1;
        }

        return 0;
      },
    },
    {
      title: "Applied Date",
      key: "applyDate",
      align: "center",
      render: (record) => (
        <Typography>
          {record.applyDate
            ? dayjs(record.applyDate).format("DD/MM/YYYY")
            : "01/01/0001"}
        </Typography>
      ),
      sorter: (a, b) => {
        if (a.applyDate && b.applyDate) {
          return (
            dayjs(a.applyDate, "YYYY-MM-DD").unix() -
            dayjs(b.applyDate, "YYYY-MM-DD").unix()
          );
        } else if (a.applyDate) {
          return 1;
        } else if (b.applyDate) {
          return -1;
        }
        return 0;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return (
          <>
            <Tag color={text === "COMPLETED" ? "green" : "orange"}>
              {text ? text : "NULL"}
            </Tag>
          </>
        );
      },
      align: "center",
      filters: [
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "PENDING", value: "PENDING" },
        { text: "NULL", value: "" },
      ],
      onFilter: (value, record) => {
        if (record.status !== null) {
          return record.status.indexOf(value) === 0;
        }
        if (value === "") return record.status === null;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="Click to see CV">
              <Button
                icon={<EyeOutlined style={{ color: "green" }} />}
                onClick={() => {
                  newPage(`/view-resume?_resumeID=${record.cvId}`);
                }}
              ></Button>
            </Tooltip>
            <Tooltip title="Click to see position detail">
              <Button
                icon={<FolderOpenTwoTone />}
                onClick={() => {
                  newPage(`/positions/${record.vacancy.id}`);
                }}
              ></Button>
            </Tooltip>
          </>
        );
      },
      width: "10%",
    },
  ];
  return !userID ? (
    navigate("/")
  ) : (
    <Space direction="vertical" className="CandidateInterviewHistory">
      <Typography.Title
        level={2}
        style={{
          color: "#1890ff",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "30px",
        }}
      >
        List of Applied
      </Typography.Title>
      <Table
        bordered
        columns={columns}
        dataSource={data.listAppliedVacancies}
        rowKey={(record) => record.vacancy.id}
        style={{
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
        }}
        className="HistoryTable"
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
        }}
        loading={{
          indicator: (
            <div>
              <Spin size="large" tip="Loading..."/>
            </div>
          ),
          spinning: loading,
        }}
      ></Table>
    </Space>
  );
}
