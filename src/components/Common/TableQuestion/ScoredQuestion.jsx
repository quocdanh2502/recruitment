import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Typography } from "antd";
import InputForm from "components/InputForm";
import InputNumberForm from "components/InputNumberForm";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSetValueFilter } from "utils";
const { Title, Text } = Typography;

export default function ScoredQuestion(props) {
  const inputNumberRef = useRef(null);
  const inputNoteRef = useRef(null);
  const [enabled, setEnabled] = useState(-1);
  const [isRollBack, setIsRollBack] = useState(-1);
  const { scoredData, handleDeleteClick, handleUpdateClick } = props;
  let skillFilter = scoredData.map((item) => {
    return item.question.skill.name;
  });
  // console.log("render");

  const handleCancelClick = useCallback(() => {
    if (enabled !== -1) {
      setIsRollBack(enabled);
      setEnabled(-1);
      inputNumberRef.current = null;
      inputNoteRef.current = null;
    }
  }, [enabled]);
  useEffect(() => {
    document.addEventListener("click", handleCancelClick);
    return () => {
      document.removeEventListener("click", handleCancelClick);
    };
  }, [handleCancelClick]);

  useEffect(() => {
    setIsRollBack(() => {
      return -1;
    });
  }, [isRollBack]);

  skillFilter = createSetValueFilter(skillFilter);
  const columns = [
    {
      title: "Skills",
      dataIndex: "question",
      filters: [...skillFilter],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) =>
        record.question.skill.name.indexOf(value) === 0,
      sorter: (a, b) =>
        a.question.skill.name.length - b.question.skill.name.length,
      sortDirections: ["descend"],
      render: (question, _) => {
        return <Text>{question.skill.name}</Text>;
      },
    },
    {
      title: "Questions",
      dataIndex: "question",
      responsive: ["md"],
      defaultSortOrder: "descend",
      sorter: (a, b) => a.question.content.length - b.question.content.length,
      render: (question, _) => {
        return <Text>{question.content}</Text>;
      },
    },
    {
      title: "Answers",
      dataIndex: "question",
      responsive: ["md"],
      render: (question, _) => {
        return <Text>{question.answer}</Text>;
      },
    },
    {
      title: "Scores",
      dataIndex: "score",
      width: 10,
      render: (score, _, index) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              inputNumberRef.current = e.target;
              if (enabled !== index) {
                inputNoteRef.current = null;
                setIsRollBack(enabled);
                setEnabled(index);
              }
            }}
          >
            <InputNumberForm
              defaultValue={score}
              index={index}
              isRollBack={isRollBack}
              enabled={enabled}
            />
          </div>
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      width: 30,
      render: (note, _, index) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              inputNoteRef.current = e.target;

              if (enabled !== index) {
                inputNumberRef.current = null;
                setIsRollBack(enabled);
                setEnabled(index);
              }
            }}
          >
            <InputForm
              defaultValue={note}
              index={index}
              isRollBack={isRollBack}
              enabled={enabled}
            />
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "score",
      width: "3rem",
      render: (_, value, index) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "5rem",
            }}
          >
            {enabled === index && (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    handleUpdateClick({
                      ...value,
                      score: inputNumberRef.current
                        ? inputNumberRef.current.value
                        : value.score,
                      note: inputNoteRef.current
                        ? inputNoteRef.current.value
                        : value.note,
                    });
                    inputNumberRef.current = null;
                    inputNoteRef.current = null;
                    setEnabled(-1);
                  }}
                >
                  <FontAwesomeIcon icon="fa-solid fa-check" size="lg" />
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setIsRollBack(index);
                  }}
                >
                  <FontAwesomeIcon icon="fa-solid fa-rotate-left" size="lg" />
                </Button>
              </>
            )}
            {enabled !== index && (
              <Button
                type="link"
                onClick={() => {
                  handleDeleteClick(value);
                  inputNumberRef.current = null;
                  inputNoteRef.current = null;
                  setEnabled(-1);
                }}
              >
                <FontAwesomeIcon
                  icon="fa-regular fa-trash-can"
                  size="lg"
                  style={{ color: "#a8071a" }}
                />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <Table
      caption={
        <Title level={5} style={{ margin: "1rem 0" }}>
          Scored Questions
        </Title>
      }
      bordered
      size="middle"
      columns={columns}
      dataSource={scoredData}
    />
  );
}
