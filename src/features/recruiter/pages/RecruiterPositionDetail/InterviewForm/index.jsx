import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Table,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./InterviewForm.scss";
import recruiterApi from "api/recruiterApi";

export default function InterviewForm({
  candidateId,
  vacancyId,
  visible,
  cancelModal,
  recruiterId,
  interviewers,
  interview,
  type,
  newChange,
}) {
  const toArray = require("dayjs/plugin/toArray");
  dayjs.extend(toArray);
  const notification = useSelector((state) => state.recruiter.notification);
  const loading = useSelector((state) => state.recruiter.loading);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [chosenInterviewer, setChosenInterviewer] = useState(null);
  const format = { date: "DD/MM/YYYY", time: "HH:mm" };
  const [form] = Form.useForm();
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (notification.type)
      messageApi.open({
        type: notification.type,
        content: notification.message,
        onClose: () => dispatch(recruiterActions.resetNotification()),
      });
  }, [notification, messageApi, dispatch]);

  const onChangeTime = (time) => {
    setTime(time);
  };
  const handleChosen = (value) => {
    return chosenInterviewer
      ? value.filter((item) => item.id !== chosenInterviewer.id)
      : value;
  };

  const handleCancel = () => {
    form.resetFields();
    setChosenInterviewer(null);
    cancelModal();
  };
  const initialValues =
    type === "update"
      ? {
          Date: dayjs(interview.interviewDatetime),
          Time: dayjs(interview.interviewDatetime.split("T")[1], "HH:mm"),
        }
      : {};
  const handleSubmit = (values) => {
    const data = {
      interviewDatetime: values.Date.toArray()
        .splice(0, 3)
        .concat(values.Time.toArray().splice(3, 3)),

      candidateVacancy: {
        candidate: {
          id: candidateId,
        },
        vacancy: {
          id: parseInt(vacancyId),
        },
      },
      recruiter: {
        id: recruiterId,
      },
    };
    data.interviewDatetime[1] += 1;
    chosenInterviewer && (data.interviewer = { id: chosenInterviewer.id });
    type === "create"
      ? dispatch(recruiterActions.createInterviewRequest(data))
      : dispatch(
          recruiterActions.updateInterviewRequest({
            id: interview.interviewId,
            data,
          })
        );
    const calendar = async () => {
      return await recruiterApi.getAuthCalendar();
    };
    calendar().then((response) => {
      setTimeout(() => {
        handleCancel();
        type === "update"
          ? newChange(response, interview.interviewId)
          : newChange(response);
      }, 1500);
    });
    // code && dispatch(recruiterActions.createCalendar({code:code,id:interview.interviewId}))
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            icon={<CheckOutlined style={{ color: "green" }} />}
            onClick={() => {
              setChosenInterviewer(record);
            }}
          ></Button>
        );
      },
      width: "10%",
    },
  ];
  return (
    <div className="InterviewForm">
      {contextHolder}
      <Modal
        open={visible}
        title={type === "create" ? "Create new interview" : "Update Interview"}
        okText={type === "create" ? "Create" : "Update"}
        cancelText="Cancel"
        confirmLoading={loading}
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        className="InterviewForm"
        // width={800}
      >
        <Form
          form={form}
          name="InterviewForm"
          className="InterviewFormModal"
          initialValues={initialValues}
        >
          <Row>
            <Col flex={12}>
              <Form.Item
                name="Date"
                label="Date"
                key="Date"
                rules={[
                  {
                    required: true,
                    message: "Please choice the date for the interview!",
                  },
                ]}
              >
                <DatePicker format={format.date} />
              </Form.Item>
            </Col>

            <Col flex={12}>
              <div className="timePicker">
                <Form.Item
                  name="Time"
                  label="Time"
                  key="time"
                  rules={[
                    {
                      required: true,
                      message: "Please choice the time for the interview!",
                    },
                  ]}
                >
                  <TimePicker
                    value={time}
                    onChange={onChangeTime}
                    format={format.time}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <h3>Interviewers:</h3>

          <div className="AssistInterviewers">
            {chosenInterviewer ? (
              <div className="AssistInterviewer">
                <p>
                  {chosenInterviewer.firstName} {chosenInterviewer.lastName}
                </p>
              </div>
            ) : (
              <p></p>
            )}
          </div>

          <div>
            <Table
              columns={columns}
              dataSource={handleChosen(interviewers)}
              rowKey={(record) => record.id}
              pagination={{
                pageSize: 5,
                align: "center",
                showSizeChanger: false,
                responsive: true,
              }}
              size="small"
            />
            ;
          </div>
        </Form>
      </Modal>
    </div>
  );
}
