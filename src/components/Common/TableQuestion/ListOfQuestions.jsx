import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Typography } from "antd";
import { createSetValueFilter } from "utils";
const { Title,Text } = Typography;

export default function ListOfQuestions(props) {
  const { data, handleSelectClick } = props;
  let skillFilter = data.map((item) => {
    return item.question.skill.name;
  });
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
      render: (_, value) => {
        return (
          <Button
            type="link"
            onClick={() => {
              handleSelectClick(value);
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-hand-pointer" />
          </Button>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <Table
      caption={
        <Title level={5} style={{ margin: "1rem 0" }}>
          List of Questions
        </Title>
      }
      size="middle"
      bordered
      columns={columns}
      dataSource={data}
      onChange={onChange}
    />
  );
}
