import {
  Button,
  Descriptions,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
  Spin,
  message,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  CalculatorOutlined,
  DeleteTwoTone,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "./RecruiterPositionDetail.scss";
import InterviewForm from "./InterviewForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recruiterApi from "api/recruiterApi";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { recruiterActions } from "features/recruiter/recruiterSlice";

export default function RecruiterPositionDetail() {
  const dispatch = useDispatch();
  const { positionID } = useParams();
  const userID = useSelector((state) => state.auth.currentUser.id);
  const { Text } = Typography;
  const navigate = useNavigate();
  const notification = useSelector((state) => state.recruiter.notification);
  const loading = useSelector((state) => state.recruiter.loading);
  const [loadingData, setLoadingData] = useState(true);
  const [rerender, setRerender] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState({
    data: null,
    interviewers: [],
  });
  const [candidates, setCandidates] = useState(null);
  const [openForm, setOpenForm] = useState({
    id: 0,
    open: false,
    type: "create",
    interviewDetail: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await recruiterApi.getPositionById(positionID);
        const interviewers = await recruiterApi.getInterviewers();
        setData({
          data: data,
          interviewers: interviewers,
        });
      } catch (error) {
        window.alert("Vacancy not found");
        navigate("/recruiter");
      }
    };
    fetchData();
  }, [positionID, navigate]);
  useEffect(() => {
    if (notification.type)
      messageApi.open({
        type: notification.type,
        content: notification.message,
        onClose: () => dispatch(recruiterActions.resetNotification()),
      });
  }, [notification, messageApi, dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      return await recruiterApi.getApplications(positionID);
    };
    fetchData()
      .then((res) => {
        setCandidates(res);
        setLoadingData(false);
        localStorage.removeItem("code");
        // localStorage.removeItem("interviewId")
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setCandidates([]);
        } else {
          message.error("Something went wrong");
        }
        setLoadingData(false);
      });

  }, [positionID, rerender]);
  const newChange = (data, id=null) => {
    data && window.open(data);
    const code = localStorage.getItem("code");
    const interviewId = id!==null?id:localStorage.getItem("interviewId");
    interviewId && dispatch(
      recruiterActions.createCalendarRequest({
        code: code,
        id: interviewId,
      })
    );
    setRerender(!rerender);
  };
  const applications =
    candidates &&
    (candidates.length > 0
      ? candidates.filter((candidate) => {
          return candidate.interview === null;
        })
      : []);

  const listWaitingInterviews =
    candidates &&
    (candidates.length > 0
      ? candidates.filter((candidate) => {
          return (
            candidate.interview !== null &&
            candidate.interview.status !== "COMPLETED"
          );
        })
      : []);

  const listCompletedInterviews =
    candidates &&
    (candidates.length > 0
      ? candidates.filter((candidate) => {
          return (
            candidate.interview !== null &&
            candidate.interview.status === "COMPLETED"
          );
        })
      : []);
  const setupInterview = (id, type, interviewDetail) => {
    setOpenForm({
      id: id,
      open: true,
      type: type ? type : "create",
      interviewDetail: interviewDetail ? interviewDetail : null,
    });
  };
  const cancelModal = () => {
    setOpenForm({ id: 0, open: false, type: "create", interviewDetail: null });
  };
  const viewCV = (id) => {
    window.open(`/view-resume?_interviewID=${id}`, "_blank");
  };

  const columnsInterview = [
    {
      title: "Name",
      key: "name",
      render: (text, record) => {
        if (
          record.candidate.firstName === null &&
          record.candidate.lastName === null
        ) {
          return <Text italic>{record.candidate.email.split("@")[0]}</Text>;
        } else if (
          record.candidate.firstName === null &&
          record.candidate.lastName !== null
        ) {
          return <Text italic>{record.candidate.lastName}</Text>;
        } else if (
          record.candidate.firstName !== null &&
          record.candidate.lastName === null
        ) {
          return <Text italic>{record.candidate.firstName}</Text>;
        }
        return (
          <Text italic>
            {record.candidate.firstName + " " + record.candidate.lastName}
          </Text>
        );
      },
    },
    {
      title: "Email",
      key: "mail",
      render: (text, record) => {
        return <Text>{record.candidate.email}</Text>;
      },
    },
    {
      title: "Phone",
      key: "phone",
      render: (text, record) => {
        return (
          <Text>
            {record.candidate.phoneNumber
              ? record.candidate.phoneNumber
              : "No data"}
          </Text>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return record.interview === null ? (
          <Tooltip title="Interview Setup">
            <Button
              icon={<CalendarOutlined style={{ color: "green" }} />}
              onClick={() => setupInterview(record.candidate.id)}
            />
          </Tooltip>
        ) : (
          <Space className="action" size={1}>
            <Tooltip title="View CV">
              <Button
                icon={<EyeOutlined style={{ color: "blue" }} />}
                onClick={() => {
                  viewCV(record.interview.interviewId);
                }}
              />
            </Tooltip>

            {record.interview.status !== "COMPLETED" ? (
              <>
                <Tooltip title="Interview Setup">
                  <Button
                    icon={<CalendarOutlined style={{ color: "green" }} />}
                    onClick={() =>
                      setupInterview(
                        record.candidate.id,
                        "update",
                        record.interview
                      )
                    }
                  />
                </Tooltip>
              </>
            ) : (
              <></>
            )}
            <Popconfirm
              title="Cancel this Interview"
              description="Are you sure to cancel this Interview?"
              okText="Yes"
              cancelText="No"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              onConfirm={() =>
                dispatch(
                  recruiterActions.cancelInterviewRequest({
                    id: record.interview.interviewId,
                    reId: userID,
                  })
                )
              }
            >
              <Tooltip title="Cancel Interview">
                <Button icon={<DeleteTwoTone twoToneColor="#FF0000" />} />
              </Tooltip>
            </Popconfirm>
            <Tooltip title="Score Application">
              <Button
                icon={<CalculatorOutlined />}
                onClick={() =>
                  navigate(
                    `/recruiter/interviews/${record.interview.interviewId}`
                  )
                }
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return data.data === null ? (
    <div className="loading">
      <Spin size="large"></Spin>
    </div>
  ) : data.data.recruiter.id !== userID ? (
    setTimeout(() => {
      navigate("/recruiter");
    }, 1500)
  ) : (
    <>
      <Space
        className="RecruiterPositionDetail internal-container"
        size="large"
        direction="vertical"
      >
        {contextHolder}
        <Descriptions
          bordered
          title={<h1>Position</h1>}
          size="default"
          className="positionSummary"
          style={{
            textAlign: "center",
          }}
          column={{
            xxl: 4,
            xl: 3,
            lg: 3,
            md: 2,
            sm: 2,
            xs: 1,
          }}
        >
          <Descriptions.Item
            label="Position"
            contentStyle={{ textAlign: "center" }}
          >
            <h2>{data.data.position.name}</h2>
          </Descriptions.Item>
          <Descriptions.Item label="Dealine">
            {dayjs(data.data.endDate).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Work Place">
            {data.data.working_location
              ? data.data.working_location.split(":")[0]
              : "NO"}
          </Descriptions.Item>
          <Descriptions.Item label="Number of applications">
            {loading ? 0 : candidates.length}
          </Descriptions.Item>
          <Descriptions.Item label="Total Need">
            {data.data.totalNeeded ? data.data.totalNeeded : 0}
          </Descriptions.Item>
          <Descriptions.Item label="Remaining need">
            {data.data.remainingNeeded ? data.data.remainingNeeded : 0}
          </Descriptions.Item>
        </Descriptions>
        <div>
          <h1>List of Applications</h1>
          <Tabs
            defaultActiveKey="1"
            type="card"
            size="large"
            items={[
              {
                label: "Waiting Interview",
                key: "Waiting Interview",
                children: (
                  <Table
                    columns={columnsInterview}
                    dataSource={applications ? applications : []}
                    rowKey={(record) => record.candidate.id}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                    style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.1)" }}
                    loading={{
                      indicator: (
                        <div>
                          <Spin size="large" />
                        </div>
                      ),
                      spinning: loadingData,
                    }}
                  />
                ),
              },
              {
                label: "Interviewing",
                key: "Interviewing",
                children: (
                  <Table
                    columns={columnsInterview}
                    dataSource={
                      listWaitingInterviews ? listWaitingInterviews : []
                    }
                    rowKey={(record) => record.interview.interviewId}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                    style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.1)" }}
                    loading={{
                      indicator: (
                        <div>
                          <Spin size="large" />
                        </div>
                      ),
                      spinning: loadingData,
                    }}
                  />
                ),
              },
              {
                label: "Interviewed",
                key: "Interviewed",
                children: (
                  <Table
                    columns={columnsInterview}
                    dataSource={
                      listCompletedInterviews ? listCompletedInterviews : []
                    }
                    rowKey={(record) => record.interview.interviewId}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                    style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.1)" }}
                  />
                ),
              },
            ]}
          />
          <InterviewForm
            visible={openForm.open}
            candidateId={openForm.id}
            cancelModal={cancelModal}
            vacancyId={positionID}
            recruiterId={userID}
            interviewers={data.interviewers}
            type={openForm.type}
            interview={openForm.interviewDetail}
            newChange={newChange}
          />
        </div>
      </Space>
    </>
  );
}
