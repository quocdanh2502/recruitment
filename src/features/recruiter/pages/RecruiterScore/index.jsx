import { useParams } from "react-router-dom";
import "./RecruiterScore.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Form,
  Row,
  Skeleton,
  Typography,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import recruiterApi from "api/recruiterApi";
import DescriptionInterview from "components/Common/DescriptionInterview";
import InputNumberForm from "components/InputNumberForm";
import { useCallback, useEffect, useRef, useState } from "react";

const { Title, Text } = Typography;
export default function RecruiterScore() {
  const params = useParams();
  const scoreRef = useRef();
  const summaryRef = useRef();
  const formRef = useRef();
  const [interviewDetail, setInterviewDetail] = useState();
  const interviewIdRef = useRef();
  const recruiterIdRef = useRef();
  const [enabled, setEnabled] = useState(-1);
  const [isRollBack, setIsRollBack] = useState(-1);
  const [pending, setPending] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = useCallback(
    (type) => {
      if (type === "success")
        api[type]({
          message: "Notification",
          description: "Update Successfully",
          duration: 2,
        });
      if (type === "error")
        api[type]({
          message: "Notification",
          description: "Update Failed",
          duration: 2,
        });
      if (type === "info")
        api[type]({
          message: "Notification",
          description: "Interview is NOT Exist",
          duration: 6,
        });
    },
    [api]
  );

  const fetchInterviewDetail = useCallback(async () => {
    try {
      const interviewDetail = await recruiterApi.getInterviewById(
        params.interviewId
      );
      setInterviewDetail(interviewDetail);
      interviewIdRef.current = interviewDetail.id;
      recruiterIdRef.current = interviewDetail.recruiter.id;
      summaryRef.current = interviewDetail.summary;
    } catch (error) {
      openNotificationWithIcon("info");
    }
  }, [openNotificationWithIcon, params.interviewId]);

  useEffect(() => {
    fetchInterviewDetail();
  }, [fetchInterviewDetail]);

  useEffect(() => {
    setIsRollBack(-1);
  }, [isRollBack]);

  const handleSubmitClick = async (values) => {
    console.log("asd", values);
  };

  const handleUpdateScoreClick = async () => {
    console.log(scoreRef.current.value);
    if (enabled === "soft") {
      try {
        setPending(true);
        await recruiterApi.updateSoftScore(
          {
            interviewId: interviewIdRef.current,
            recruiterId: recruiterIdRef.current,
          },
          scoreRef.current.value
        );
        openNotificationWithIcon("success");
      } catch (error) {
        openNotificationWithIcon("error");
      } finally {
        setPending(false);
      }
    } else if (enabled === "language") {
      try {
        setPending(true);
        await recruiterApi.updateLanguageScore(
          {
            interviewId: interviewIdRef.current,
            recruiterId: recruiterIdRef.current,
          },
          scoreRef.current.value
        );
        openNotificationWithIcon("success");
      } catch (error) {
        openNotificationWithIcon("error");
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="RecruiterScore">
        <DescriptionInterview interviewDetail={interviewDetail} />

        <Title
          style={{
            borderTop: "#e5e5e5 0.1px solid",
            width: "100%",
            padding: "1rem 0",
          }}
          className="title"
          level={5}
        >
          Candidate Score
        </Title>

        <Row>
          {/* SoftSkill-------------------------------------- */}
          <Skeleton active loading={pending}>
            <Col
              xs={24}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Text
                strong
                style={{
                  width: "5rem",
                  textAlign: "start",
                }}
              >
                Soft Skills
              </Text>
              <div style={{ width: "5rem" }}>
                <InputNumberForm
                  defaultValue={
                    interviewDetail && interviewDetail.softSkillScore
                  }
                  index={"soft"}
                  enabled={enabled}
                  isRollBack={isRollBack}
                  onClick={(e) => {
                    scoreRef.current = e.target;
                    setEnabled("soft");
                  }}
                  disabled={
                    interviewDetail && interviewDetail.status === "PENDING"
                      ? false
                      : true
                  }
                />
              </div>
              {enabled === "soft" && (
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      setIsRollBack(enabled);
                      setEnabled(-1);
                    }}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-rotate-left" size="lg" />
                  </Button>
                  <Button type="primary" size="small">
                    <FontAwesomeIcon
                      icon="fa-solid fa-check"
                      size="lg"
                      onClick={handleUpdateScoreClick}
                    />
                  </Button>
                </>
              )}
            </Col>
          </Skeleton>

          {/* LanguageSkill------------------------------------ */}

          <Skeleton active loading={pending}>
            <Col
              xs={24}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Text
                strong
                style={{
                  width: "5rem",
                  textAlign: "start",
                }}
              >
                Languages
              </Text>
              <div style={{ width: "5rem" }}>
                <InputNumberForm
                  defaultValue={
                    interviewDetail && interviewDetail.languageSkillScore
                  }
                  index={"language"}
                  enabled={enabled}
                  isRollBack={isRollBack}
                  onClick={(e) => {
                    scoreRef.current = e.target;
                    setEnabled("language");
                  }}
                  disabled={
                    interviewDetail && interviewDetail.status === "PENDING"
                      ? false
                      : true
                  }
                />
              </div>
              {enabled === "language" && (
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      setIsRollBack(enabled);
                      setEnabled(-1);
                    }}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-rotate-left" size="lg" />
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleUpdateScoreClick}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-check" size="lg" />
                  </Button>
                </>
              )}
            </Col>
          </Skeleton>
        </Row>

        {/* Submit summary------------------------------ */}
        <Form
          initialValues={{
            remember: true,
          }}
          ref={formRef}
          autoComplete="off"
          onFinish={handleSubmitClick}
          style={{ padding: "1rem 0" }}
        >
          <Form.Item name={"summary"}>
            <TextArea
              autoSize={{ minRows: 4, maxRows: 8 }}
              placeholder="Summary"
            />
          </Form.Item>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            {interviewDetail && interviewDetail.status === "PENDING" && (
              <>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
                <Button
                  htmlType="reset"
                  type="default"
                  style={{ marginRight: "1rem" }}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    </>
  );
}
