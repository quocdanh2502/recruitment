import { useParams } from "react-router-dom";
import "./InterviewerScore.scss";

import { Skeleton, notification } from "antd";
import interviewerApi from "api/interviewerApi";
import DescriptionInterview from "components/Common/DescriptionInterview";
import TableQuestion from "components/Common/TableQuestion";
import { interviewerSelectors } from "features/interviewer/interviewerSlice";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function InterviewerScore() {
  const params = useParams();

  const [pending, setPending] = useState(false);

  const [interviewDetail, setInterviewDetail] = useState(null);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = useCallback(
    (type) => {
      if (type === "success-add")
        api["success"]({
          message: "Notification",
          description: "Add Successfully",
          duration: 2,
        });
      if (type === "success-update")
        api["success"]({
          message: "Notification",
          description: "Update Successfully",
          duration: 2,
        });
      if (type === "success-delete")
        api["success"]({
          message: "Notification",
          description: "Delete Successfully",
          duration: 2,
        });
      if (type === "error-add")
        api["error"]({
          message: "Notification",
          description: "Add Failed",
          duration: 2,
        });
      if (type === "error-update")
        api["error"]({
          message: "Notification",
          description: "Update Failed",
          duration: 2,
        });
      if (type === "error-delete")
        api["error"]({
          message: "Notification",
          description: "Delete Failed",
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
      setPending(true);
      const data = await interviewerApi.getInterviewById(params.interviewId);
      setInterviewDetail(data);
    } catch (error) {
      openNotificationWithIcon("info");
    } finally {
      setPending(false);
    }
  }, [openNotificationWithIcon, params.interviewId]);

  useEffect(() => {
    fetchInterviewDetail();
  }, [fetchInterviewDetail]);

  const { questions } = useSelector(interviewerSelectors);

  return (
    <>
      {contextHolder}
      <div className="InterviewerScore">
        <DescriptionInterview interviewDetail={interviewDetail} />

        <Skeleton loading={pending} active style={{ height: "80vh" }}>
          <TableQuestion
            questions={questions.map((item) => {
              return {
                question: {
                  ...item,
                },
                interviewId: parseInt(params.interviewId),
                key: item.id,
                score: null,
                note: null,
              };
            })}
            interviewQuestions={
              interviewDetail &&
              interviewDetail.interviewQuestion.map((item) => {
                return {
                  ...item,
                  key: item.question.id,
                };
              })
            }
            openNotificationWithIcon={openNotificationWithIcon}
          />
        </Skeleton>
      </div>
    </>
  );
}
