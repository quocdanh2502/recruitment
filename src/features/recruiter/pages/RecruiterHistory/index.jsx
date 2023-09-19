import "./RecruiterHistory.scss";
import { Button, Space, Table, Modal, Tooltip, Card } from "antd";
import { useEffect, useState } from "react";
import {
  WarningOutlined,
  AuditOutlined,
  DeleteOutlined,
  CalculatorOutlined,
  StopOutlined,
  LoadingOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  recruiterActions,
  recruiterSelectors,
} from "features/recruiter/recruiterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { authSelectors } from "features/auth/authSlice";

const dataFilterVacancy = [
  {
    text: "Front-end Developer",
    value: "Front-end Developer",
  },
  {
    text: "Back-end Developer",
    value: "Back-end Developer",
  },
  {
    text: "Full-stack Developer",
    value: "Full-stack Developer",
  },
  {
    text: "Embedded",
    value: "Embedded",
  },
  {
    text: "Business Analysis",
    value: "Business Analysis",
  },
];

const dataFilterLocation = [
  {
    text: "FPT F-Town 1",
    value: "FPT F-Town 1",
  },
  {
    text: "FPT F-Town 2",
    value: "FPT F-Town 2",
  },
  {
    text: "FPT F-Town 3",
    value: "FPT F-Town 3",
  },
];

function RecruiterHistory() {
  //get data API
  const { currentUser } = useSelector(authSelectors);
  const { currentHistory } = useSelector(recruiterSelectors);
  const dispatch = useDispatch();

  // Location
  const location = useLocation();

  //State
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(currentHistory.status != "200");
  const [isLoading, setLoading] = useState(true);
  const [modalText, setModalText] = useState("Wait for data loading...");
  const [modal, contextHolder] = Modal.useModal();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 7,
    },
  });
  const [dataFilterLocation, setDataFilterLocation] = useState([]);
  // Navigate
  const navigate = useNavigate();
  // Function
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // Set up columns
  const columns = [
    {
      title: "Candidate",
      dataIndex: "candidateVacancy",
      key: "candidateVacancy",
      render: (candidateVacancy) =>
        `${candidateVacancy.candidate.firstName}
          ${candidateVacancy.candidate.lastName}`,
      width: "20%",
    },
    {
      title: "Job position",
      dataIndex: "candidateVacancy",
      filters: dataFilterVacancy,
      filterSearch: true,
      onFilter: (value, record) => record.position.includes(value),
      render: (candidateVacancy) => `${candidateVacancy.vacancy.position.name}`,
      width: "15%",
    },
    {
      title: "Place",
      dataIndex: "venue",
      filters: dataFilterLocation,
      filterSearch: true,
      onFilter: (value, record) => record.place.includes(value),
    },
    {
      title: "Time",
      dataIndex: "interviewDatetime",
      sort: true,
      render: (datetime) => moment(datetime).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Interviewer",
      dataIndex: "interviewer",
      render: (interviewer) =>
        interviewer ? `${interviewer.firstName} ${interviewer.lastName}` : "",
    },
    {
      title: "Total score",
      dataIndex: "totalScore",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      width: "10%",
      render: (_, record) => {
        return (
          <Space size="small">
            <Tooltip title="Detail score">
              <Link to={`/recruiter/interviews/${record.id}`} target="_blank">
                <Button
                  type="link"
                  style={{ color: "green" }}
                  target="_blank"
                  size="medium"
                  icon={<CalculatorOutlined />}
                  className="btn-action btn-calculator"
                ></Button>
              </Link>
            </Tooltip>
            <Tooltip title="Candidate's CV">
              <Link
                to={`/view-resume?_interviewID=${record.id}`}
                target="_blank"
              >
                <Button
                  type="link"
                  style={{ color: "blue" }}
                  target="_blank"
                  size="medium"
                  icon={<AuditOutlined />}
                  className="btn-action btn-view"
                ></Button>
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (isLoading) {
      if (!currentUser) {
        navigate("/login");
      }
      if (!currentHistory.status) {
        dispatch(recruiterActions.getHistory());
      } else {
        if (currentHistory.status === "200") {
          setData(
            [...currentHistory.data]
              .filter((object) => {
                return object.recruiter.id === currentUser.id;
              })
              .reverse()
          );
          setLoading(false);
          setModalText("Loading success!");
          setTimeout(() => {
            setOpenModal(false);
          }, 1000);
        } else if (currentHistory.status === "403") {
          if (location.state) {
            window.history.replaceState({}, document.title);
          } else {
            setModalText("Loading failed!");
          }
        }
      }
    }

    //Modal funtion
    if (document.getElementsByClassName("ant-modal-close").length === 1) {
      document
        .getElementsByClassName("ant-modal-close")[0]
        .addEventListener("click", () => {
          setOpenModal(false);
        });
    }

    return () => {};
  }, [
    currentHistory,
    currentHistory.status,
    dispatch,
    isLoading,
    dataFilterLocation,
  ]);
  return (
    <>
      <div className="HistoryReccer internal-container">
        <Modal
          title={
            isLoading
              ? currentHistory.status === "403"
                ? "Failed!"
                : "Loading..."
              : "Success!"
          }
          open={openModal}
          cancelButtonProps={false}
          footer={null}
          bodyStyle={{ padding: "15px", fontSize: "1.2rem" }}
        >
          <p
            style={
              isLoading
                ? currentHistory.status === "403"
                  ? { color: "red" }
                  : { color: "orange" }
                : { color: "green" }
            }
          >
            {isLoading ? (
              currentHistory.status === "403" ? (
                <StopOutlined
                  style={{ marginRight: "15px", fontSize: "1.5rem" }}
                />
              ) : (
                <LoadingOutlined
                  style={{ marginRight: "15px", fontSize: "1.5rem" }}
                />
              )
            ) : (
              <CheckOutlined
                style={{ marginRight: "15px", fontSize: "1.5rem" }}
              />
            )}
            {modalText}
          </p>
        </Modal>
        {!isLoading && (
          <>
            {contextHolder}
            <Card
              title="Manage history"
              className="table-wrapper"
              bodyStyle={{ padding: 0 }}
              headStyle={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              <Table
                columns={columns}
                rowKey={(record) => `${record.id}`}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={isLoading}
                onChange={handleTableChange}
                size="small"
                className="HomeReccer-main"
              />
              <Table
                columns={columns}
                rowKey={(record) => `${record.id}`}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={isLoading}
                onChange={handleTableChange}
                size="small"
                className="HomeReccer-sub"
                scroll={{
                  x: 1100,
                }}
              />
            </Card>
          </>
        )}
      </div>
    </>
  );
}

export default RecruiterHistory;
