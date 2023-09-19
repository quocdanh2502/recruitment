import {
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  StopOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import recruiterApi from "api/recruiterApi";
import {
  recruiterActions,
  recruiterSelectors,
} from "features/recruiter/recruiterSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./RecruiterEvent.scss";
import { authSelectors } from "features/auth/authSlice";

function RecruiterEventList() {
  // Get data API
  const { currentUser } = useSelector(authSelectors);
  const { currentEvents } = useSelector(recruiterSelectors);
  const dispatch = useDispatch();

  // Navigate
  const navigate = useNavigate();

  // State
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(currentEvents.status !== "200");
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

  // Message
  const [messageApi, contextMessage] = message.useMessage();

  const messageSuccess = useCallback(() => {
    messageApi.open({
      type: "success",
      content: "Delete success!",
      duration: 2,
    });
  }, [messageApi]);

  const messageError = useCallback(() => {
    messageApi.open({
      type: "error",
      content: "Delete failed!",
      duration: 2,
    });
  }, [messageApi]);

  // Function
  const clearAll = useCallback(() => {
    setFilteredInfo({});
    setSortedInfo({});
  }, []);

  const handleView = useCallback(
    (record) => {
      navigate(`${record.id}`, {
        state: {
          role: "recruiter",
          classify: "view",
          id: record.id,
        },
      });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      navigate(`edit/${id}`, {
        state: {
          role: "recruiter",
          classify: "edit",
          id: id,
        },
      });
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id) => {
      await recruiterApi
        .deleteEvent(id)
        .then((res) => {
          const newData = data.filter((object) => {
            return object.id !== id;
          });
          setData(newData);
          messageSuccess();
          dispatch(recruiterActions.getEvents());
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
          messageError();
        });
    },
    [data, messageError, messageSuccess, dispatch],
  )

  const handleAdd = useCallback(
    (id) => {
      navigate(`create`, {
        state: {
          id: id,
          role: "recruiter",
          classify: "add",
        },
      });
    },
    [navigate]
  );

  const confirm = useCallback(
    (record) => {
      modal.confirm({
        title: "Xác nhận",
        icon: <ExclamationCircleOutlined />,
        content: "Tạo thêm một sự kiện mới?",
        okText: "Có",
        cancelText: "Không",
        onOk: () => {
          return handleAdd(crypto.randomUUID());
        },
      });
    },
    [handleAdd, modal]
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
      title: "Event",
      dataIndex: "name",
      key: "name",
      width: "18%",
      fixed: "left",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filters: dataFilterLocation,
      filterSearch: true,
      filteredValue: filteredInfo.location || null,
      onFilter: (value, record) => record.location.includes(value),
      width: "15%",
    },
    {
      title: "Created",
      dataIndex: "createAt",
      key: "createAt",
      sort: true,
      sorter: (a, b) => new Date(a.createAt) - new Date(b.createAt),
      sortOrder: sortedInfo.columnKey === "createAt" ? sortedInfo.order : null,
      width: "10%",
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
      width: "11%",
    },
    {
      title: "State",
      key: "status",
      width: "11%",

      filters: [
        {
          text: "In process",
          value: "In process",
        },
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Coming",
          value: "Coming",
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
      // onFilter: (value, record) => {
      //   return record.status === value;
      // },
      // render: (value, record) => {
      //   let color, icon;
      //   switch (value) {
      //     case "In process":
      //       color = "success";
      //       icon = <CheckCircleOutlined />;
      //       break;
      //     case "Completed":
      //       color = "error";
      //       icon = <CloseCircleOutlined />;
      //       break;
      //     case "Coming":
      //       color = "#87d068";
      //       icon = <ClockCircleOutlined />;
      //       break;
      //     case "Blocked":
      //       color = "#f50";
      //       icon = <ToolOutlined />;
      //       break;
      //     default:
      //       color = "default";
      //       break;
      //   }
      //   return (
      //     <Tag icon={icon} color={color}>
      //       {value}
      //     </Tag>
      //   );
      // },
      // width: "10%",
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
                  return handleView(record);
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
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={(e) => {
                return handleDelete(record.id);
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
            </Popconfirm>
          </Space>
        );
      },
      width: "12%",
    },
  ];

  useEffect(() => {
    if (isLoading) {
      if (!currentUser) {
        navigate('/login');
      }
      if (!currentEvents.status) {
        dispatch(recruiterActions.getEvents());
      } else {
        if (currentEvents.status === "200") {
          setData([...currentEvents.data].filter(object => {
            return object.recruiter.id === currentUser.id;
          }).reverse());
          setLoading(false);
          setModalText("Loading success!");
          setTimeout(() => {
            setOpenModal(false);
          }, 1000);
        } else if (currentEvents.status === "403") {
          setModalText("Loading failed!");
        }
      }
    }

    return () => { };
  }, [data, currentEvents, currentEvents.status, dispatch, isLoading, currentUser, navigate]);

  useEffect(() => {
    // Filter data
    // let newArray = [...dataFilterLocation];
    // for (let i = 0; i < currentEvents.data.length; i++) {
    //   if (
    //     !newArray.some((object) => {
    //       return object.value === currentEvents.data[i].location;
    //     })
    //   ) {
    //     const toSetData = {
    //       text: currentEvents.data[i].location,
    //       value: currentEvents.data[i].location,
    //     };
    //     newArray.push(toSetData);
    //   }
    // }
    // setDataFilterLocation(newArray);

    // Modal function
    if (document.getElementsByClassName("ant-modal-close").length === 1) {
      document
        .getElementsByClassName("ant-modal-close")[0]
        .addEventListener("click", () => {
          setOpenModal(false);
        });
    }
    return () => { };
  }, []);

  return (
    <div className="RecruiterEvent internal-container">
      {contextMessage}
      <Modal
        title={
          isLoading
            ? currentEvents.status === "403"
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
              ? currentEvents.status === "403"
                ? { color: "red" }
                : { color: "orange" }
              : { color: "green" }
          }
        >
          {isLoading ? (
            currentEvents.status === "403" ? (
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
            title="Manage events"
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
              className="RecruiterEvent-main"
            />
            <Table
              columns={columns}
              rowKey={(record) => `${record.id}`}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={isLoading}
              onChange={handleTableChange}
              className="RecruiterEvent-sub"
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

export default function RecruiterEvent() {
  // useEffect(() => {
  // }, []);

  return <RecruiterEventList />;
}
