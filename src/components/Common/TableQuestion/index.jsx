import { Skeleton } from "antd";
import interviewerApi from "api/interviewerApi";
import { useCallback, useEffect, useState } from "react";
import ListOfQuestions from "./ListOfQuestions";
import ScoredQuestion from "./ScoredQuestion";
import "./TableQuestion.scss";

export default function TableQuestion(props) {
  const { questions, interviewQuestions, openNotificationWithIcon } = props;
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(false);
  const [scoredData, setScoredData] = useState([]);

  useEffect(() => {
    if (interviewQuestions && questions) {
      setScoredData(interviewQuestions);
      const scoredQuestionsId = interviewQuestions.map(
        (item) => item.question.id
      );
      const data = questions.filter(
        (item) => !scoredQuestionsId.includes(item.key)
      );
      setData(data);
    }
  }, [interviewQuestions, questions]);

  const handleSelectClick = useCallback(
    async (value) => {
      try {
        setPending(true);
        await interviewerApi.addQuestionInterview(value);
        const newData = data.filter((item) => {
          return item.key !== value.key;
        });
        setData(newData);
        setScoredData((state) => {
          return [...state, value];
        });

        openNotificationWithIcon("success-add");
      } catch (error) {
        openNotificationWithIcon("error-add");
      } finally {
        setPending(false);
      }
    },
    [data, openNotificationWithIcon]
  );
  const handleDeleteClick = useCallback(
    async (value) => {
      try {
        setPending(true);

        await interviewerApi.deleteQuestionInterview({
          interviewId: value.interviewId,
          questionId: value.key,
        });

        const newData = scoredData.filter((item) => {
          return item.key !== value.key;
        });
        setScoredData(newData);

        setData((state) => {
          return [...state, { ...value, note: null, score: null }];
        });

        openNotificationWithIcon("success-delete");
      } catch (error) {
        openNotificationWithIcon("error-delete");
      } finally {
        setPending(false);
      }
    },
    [scoredData, openNotificationWithIcon]
  );
  const handleUpdateClick = useCallback(
    async (value) => {
      try {
        setPending(true);

        await interviewerApi.updateScore(value);
        const newData = scoredData.map((item) => {
          if (item.key === value.key)
            return {
              ...item,
              score: value.score,
              note: value.note,
            };
          return item;
        });
        setScoredData(newData);
        openNotificationWithIcon("success-update");
      } catch {
        openNotificationWithIcon("error-update");
      } finally {
        setPending(false);
      }
    },
    [scoredData, openNotificationWithIcon]
  );

  return (
    <div className="TableQuestion">
      <Skeleton loading={pending} style={{ height: "40vh" }} active>
        <ScoredQuestion
          scoredData={scoredData}
          handleDeleteClick={handleDeleteClick}
          handleUpdateClick={handleUpdateClick}
        />
      </Skeleton>

      <Skeleton loading={pending} style={{ height: "40vh" }} active>
        <ListOfQuestions data={data} handleSelectClick={handleSelectClick} />
      </Skeleton>
    </div>
  );
}
