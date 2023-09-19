import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  StopOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  message
} from "antd";
import {
  recruiterActions,
  recruiterSelectors,
} from "features/recruiter/recruiterSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./RecruiterHome.scss";
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
    text: "Ha Noi",
    value: "Ha Noi",
    children: [
      {
        text: "FPT A",
        value: "FPT A",
      },
      {
        text: "FPT B",
        value: "FPT B",
      },
    ],
  },
  {
    text: "Ho Chi Minh",
    value: "Ho Chi Minh",
    children: [
      {
        text: "FPT Software F-Town 1",
        value: "FPT Software F-Town 1",
      },
      {
        text: "FPT Software F-Town 3",
        value: "FPT Software F-Town 3",
      },
    ],
  },
];
function RecruiterHomeList() {
  // Get data api
  const { currentPositions } = useSelector(recruiterSelectors);
  const { currentUser } = useSelector(authSelectors);
  const dispatch = useDispatch();

  // State
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(currentPositions.status !== "200");
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

  // Navigate
  const navigate = useNavigate();

  // Function
  const clearAll = useCallback(() => {
    setFilteredInfo({});
    setSortedInfo({});
  }, []);

  const confirm = useCallback(
    (record) => {
      modal.confirm({
        title: "Xác nhận",
        icon: <ExclamationCircleOutlined />,
        content: "Tạo thêm một yêu cầu tuyển dụng mới?",
        okText: "Có",
        cancelText: "Không",
        onOk: () => {
          return navigate("/recruiter/positions/create-position");
        },
      });
    },
    [modal, navigate],
  )

  const handleView = useCallback(
    (id) => {
      navigate(`/recruiter/positions/${id}`, {
        state: {
          id: id,
        },
      });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      navigate(`/recruiter/positions/update-position/${id}`);
    },
    [navigate]
  );

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  }, []);

  // Set up columns
  const columns = [
    {
      title: "Vacancy",
      dataIndex: "position",
      key: "name",
      render: (position) => `${position.name}`,
      filters: dataFilterVacancy,
      filterSearch: true,
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      width: "15%",
      fixed: "left",
    },
    {
      title: "Total needed",
      dataIndex: "totalNeeded",
      key: "totalNeeded",
      sort: true,
      sorter: (a, b) => a.totalNeeded - b.totalNeeded,
      width: "8%",
    },
    {
      title: "Working location",
      dataIndex: "workingLocation",
      key: "workingLocation",
      filters: dataFilterLocation,
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo.workingLocation || null,
      onFilter: (value, record) => record.workingLocation.includes(value),
      width: "24%",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      sort: true,
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      sortOrder: sortedInfo.columnKey === "startDate" ? sortedInfo.order : null,
      width: "11%",
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      sort: true,
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      sortOrder: sortedInfo.columnKey === "endDate" ? sortedInfo.order : null,
      width: "10%",
    },
    {
      title: "State",
      key: "status",
      width: "11%",

      filters: [
        {
          text: "Coming",
          value: "Coming",
        },
        {
          text: "In process",
          value: "In process",
        },
        {
          text: "Completed",
          value: "Completed",
        },
      ],
      filterSearch: true,
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => {
        const startDates = new Date(record.startDate);
        const endDates = new Date(record.endDate);
        const date = new Date();
        if (value === "Coming") {
          return date < startDates;
        }
        if (value === "In process") {
          return endDates > date;
        }
        if (value === "Completed") {
          return endDates <= date;
        }
      },

      render: (text, record) => {
        let status = "In process";
        let color = "green";
        let icon = <CheckOutlined twoToneColor="#52c41a" />;
        const startDates = new Date(record.startDate);
        const endDates = new Date(record.endDate);
        const date = new Date();
        if (startDates > date) {
          color = "blue";
          status = "Coming";
          icon = <ClockCircleOutlined twoToneColor="#FF3939" />;
        } else if (endDates <= date) {
          color = "red";
          status = "Completed";
          icon = <CloseCircleOutlined twoToneColor="#FF3939" />;
        }

        return (
          <Tag color={color} key={status} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter",
      key: "recruiter",
      render: (recruiter) => {
        if (recruiter) {
          if (recruiter.firstName && recruiter.lastName) {
            return `${recruiter.firstName + " " + recruiter.lastName}`
          } else if (recruiter.firstName) {
            return `${recruiter.firstName}`
          } else if (recruiter.lastName) {
            return `${recruiter.lastName}`
          }
        };
        return `${recruiter.email}`
      },
      width: "13%",
    },
    {
      title: "Action",
      dataIndex: "uuid",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="small">
            <Tooltip title="Click to view detail">
              <Button
                type="link"
                onClick={() => {
                  return handleView(record.id);
                }}
                className="btn-action btn-view"
                style={{ color: "green" }}
                icon={<EyeOutlined />}
              ></Button>
            </Tooltip>
            <Tooltip title="Click to edit">
              <Button
                type="link"
                onClick={() => {
                  return handleEdit(record.id);
                }}
                className="btn-action btn-edit"
                style={{ color: "blue" }}
                icon={<EditOutlined />}
              ></Button>
            </Tooltip>
            {/* <Popconfirm
              title="Hide this task"
              description="Are you sure to hide this task?"
              onConfirm={(e) => {
                return handleHide(record.id);
              }}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                className="btn-action btn-delete"
                style={{ color: "red" }}
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm> */}
          </Space>
        );
      },
      width: "8%",
    },
  ];

  // Effect
  useEffect(() => {
    // Dispatch actions
    if (isLoading) {
      if (!currentPositions.status) {
        dispatch(recruiterActions.getPositions({ page: 1, limit: 200 }));
      } else {
        if (currentPositions.status === "200") {
          setData([...currentPositions.data].filter(object => {
            return object.recruiter.id === currentUser.id;
          }).reverse());
          setLoading(false);
          setModalText("Loading success!");
          setTimeout(() => {
            setOpenModal(false);
          }, 1000);
        } else if (currentPositions.status === "403") {
          setModalText("Loading failed!");
        }
      }
    }
    return () => { };
  }, [currentPositions.data, currentPositions.status, currentUser, dispatch, isLoading]);

  useEffect(() => {
    // Modal function
    if (document.getElementsByClassName("ant-modal-close").length === 1) {
      document
        .getElementsByClassName("ant-modal-close")[0]
        .addEventListener("click", () => {
          setOpenModal(false);
        });
    }
    return () => {

    };
  }, []);

  return (
    <div className="RecruiterHome internal-container">
      <Modal
        title={
          isLoading
            ? currentPositions.status === "403"
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
              ? currentPositions.status === "403"
                ? { color: "red" }
                : { color: "orange" }
              : { color: "green" }
          }
        >
          {isLoading ? (
            currentPositions.status === "403" ? (
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
          <Space className="btn-main-wrapper">
            <Button
              type="primary"
              onClick={() => {
                return confirm();
              }}
              style={{
                width: "100px",
                height: "40px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              THÊM
            </Button>
            <Button
              onClick={clearAll}
              style={{
                textTransform: "uppercase",
                height: "40px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Clear filters and sorters
            </Button>
          </Space>
          {contextHolder}
          <Card
            title="Manage vacancies"
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
              size="middle"
              className="RecruiterHome-main"
            />
            <Table
              columns={columns}
              rowKey={(record) => `${record.id}`}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={isLoading}
              onChange={handleTableChange}
              className="RecruiterHome-sub"
              size="middle"
              scroll={{
                x: 1100,
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
}

export default function RecruiterHome() {
  return <RecruiterHomeList />;
}
