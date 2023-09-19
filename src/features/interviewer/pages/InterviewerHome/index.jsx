import "./InterviewerHome.scss";
import {
  AuditOutlined,
  EditFilled,
  UserOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Row, Col, Space, Tooltip, Button, Tag, DatePicker, message, Typography, Card } from "antd";
import moment from "moment";
import CustomTable from "components/Common/CustomTable";
import { authSelectors } from "features/auth/authSlice";
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import interviewerApi from "api/interviewerApi";

const { RangePicker } = DatePicker;

const columns = [
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    isSearchByValue: true,
    fixed: "left",
  },
  {
    title: "Recruiter",
    dataIndex: "recruiter",
    key: "recruiter",
    isSearchByValue: true,
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    isSearchByValue: true,
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    sorter: (a, b) => moment(a.time, "HH:mm DD/MM/YYYY").unix() - moment(b.time, "HH:mm DD/MM/YYYY").unix(),
  },
  {
    title: "Place",
    dataIndex: "place",
    key: "place",
  },
  {
    title: "Candidate",
    dataIndex: "candidate",
    key: "candidate",
    isSearchByValue: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      {
        text: "COMPLETED",
        value: "COMPLETED",
      },
      {
        text: "CANCELLED",
        value: "CANCELLED",
      },
      {
        text: "PENDING",
        value: "PENDING",
      },
    ],
    onFilter: (value, record) => record.status === value,
    render: (value, record) => {
      let color, icon;
      switch (value) {
        case "COMPLETED":
          color = "success";
          icon = <CheckCircleOutlined />;
          break;
        case "CANCELLED":
          color = "error";
          icon = <CloseCircleOutlined />;
          break;
        case "PENDING":
          color = "default";
          icon = <ClockCircleOutlined />;
          break;
        default:
          color = "";
          break;
      }
      return (
        <Tag icon={icon} color={color}>
          {value}
        </Tag>
      );
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (value, record) => (
      <Space>
        <Tooltip title="Candidate Evaluation" placement="top">
          <Link to={`/interviewer/interviews/${record.id}`}>
            <Button type="primary" size="small" icon={<EditFilled />} danger></Button>
          </Link>
        </Tooltip>
        <Tooltip title="Candidate's CV" placement="top">
          <Link to={`/view-resume?_interviewID=${record.id}`} target="_blank">
            <Button type="primary" target="_blank" size="small" icon={<AuditOutlined />}></Button>
          </Link>
        </Tooltip>
        {/* <Tooltip title="Recruiter's Information" placement="top">
          <Link to={`${record.id}&=${record.email}`} target="_blank">
            <Button type="primary" size="small" style={{ backgroundColor: "green" }} icon={<UserOutlined />}></Button>
          </Link>
        </Tooltip> */}
      </Space>
    ),
  },
];

const InterviewerHome = () => {
  // state
  const [messageApi, contextHolder] = message.useMessage();

  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRange, setFilterRange] = useState(null);
  const [filteredInterviews, setFilteredInterviews] = useState([]);

  const { currentUser } = useSelector(authSelectors, shallowEqual);

  // useEffect
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await interviewerApi.getInterviews();
        const formatInterviews = response
          .sort((a, b) => {
            const statusOrder = { PENDING: 0, COMPLETED: 1 };
            return statusOrder[a.status] - statusOrder[b.status];
          })
          .filter((item) => item.interviewer.id === currentUser.id)
          .map((item) => {
            return {
              id: item.id.toString(), // Convert to string as per your desired format
              recruiterId: item.recruiter.id,
              recruiter: `${item.recruiter.firstName} ${item.recruiter.lastName}`,
              position: item.candidateVacancy.vacancy.position.name,
              level: item.candidateVacancy.vacancy.level
                .map((level) => level.name.charAt(0).toUpperCase() + level.name.slice(1))
                .join(", "),
              time: moment(item.interviewDatetime).format("HH:mm DD/MM/YYYY"),
              place: item.linkMeet,
              candidateId: item.candidateVacancy.candidate.id,
              candidate: `${item.candidateVacancy.candidate.firstName} ${item.candidateVacancy.candidate.lastName}`,
              // candidateCVId: item.candidateVacancy.cvId,
              status: item.status,
            };
          });
        setInterviews(formatInterviews);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          messageApi.open({
            type: "error",
            content: "You haven't been assigned any interviews yet!",
            duration: 3,
          });
        }
        setIsLoading(false);
      }
    };
    fetchInterviews();
  }, [currentUser.id, messageApi]);

  // Filter interview when range picker changes value
  const onChange = (dates, dateStrings) => {
    if (dateStrings[0] === "" && dateStrings[1] === "") {
      setFilterRange(null);
    } else {
      setFilterRange(dates);
    }
  };

  // Clear filter
  const clearFilter = () => {
    setFilterRange(null);
    setFilteredInterviews(interviews);
  };

  // Filter interview by date range
  useEffect(() => {
    const filterData = () => {
      if (filterRange) {
        const filteredInterviews = interviews.filter((interview) => {
          const interviewTime = moment(interview.time, "HH:mm DD/MM/YYYY").format("YYYY-MM-DD");
          return (
            moment(interviewTime).isSameOrAfter(filterRange[0]) && moment(interviewTime).isSameOrBefore(filterRange[1])
          );
        });
        setFilteredInterviews(filteredInterviews);
      } else {
        setFilteredInterviews(interviews);
      }
    };

    filterData();
  }, [filterRange, interviews]);

  return (
    <React.Fragment>
      <div className="InterviewerHome internal-container">
        {contextHolder}
        <Card bodyStyle={{ borderRadius: "5px" }}>
          <Row justify="end">
            <Col span={18}>
              <Typography.Title level={4}>Interviews </Typography.Title>
            </Col>
            <Col span={6}>
              <Space>
                <RangePicker onChange={onChange} value={filterRange} />
                <Button icon={<ClearOutlined />} type="link" onClick={clearFilter}>
                  Clear Filter
                </Button>
              </Space>
            </Col>
          </Row>
          <CustomTable columns={columns} data={filterRange ? filteredInterviews : interviews} isLoading={isLoading} />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default InterviewerHome;
