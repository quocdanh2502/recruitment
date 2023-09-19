import { Button, Card, Image } from "antd";
import { Link } from "react-router-dom";
import styles from "./Position.module.scss";

function Position({ workData }) {
  console.log(workData);
  return (
    <Card
      bordered={false}
      hoverable
      style={{
        width: "100%",
        border: "1px solid #e9eaec",
        cursor: "pointer",
        "&hover": { background: "#f6f6f6" },
      }}
      className={styles["Position"]}
    >
      <div className={styles.wrapper}>
        <Link
          to={`positions/${workData.id}`}
          target="_blank"
          className={styles["img-responsive"]}
        >
          <Image
            width={100}
            src="https://danhbaict.vn/uploads/business/logo/business1618470595-FPT%20Software%20V@4x.png"
            style={{
              padding: "8px",
              border: "1px solid #e9eaec",
              borderRadius: "8px",
            }}
            preview={false}
          />
        </Link>
        <div className={styles["content"]}>
          <div className={styles["name"]}>
            <Link to={`positions/${workData.id}`}>
              <div className={styles["name-work"]}>
                {workData.position.name}
              </div>
              <p className={styles["name-cop"]}>FPT Software</p>
            </Link>
          </div>
          <div className={styles["detail"]}>
            <div className={styles["description"]}>
              {workData.description
                ? workData.description
                : "Bấm ứng tuyển để xem chi tiết"}
            </div>
            <div className={styles["tags"]}>
              {workData.salary ? (
                <span
                  style={{ cursor: "default" }}
                  className={styles["tag-responsive-hidden"]}
                >
                  {workData.salary}$
                </span>
              ) : (
                ""
              )}
              {workData.workingLocation ? (
                <span
                  style={{ cursor: "default" }}
                  className={styles["tag-responsive-hidden"]}
                >
                  {workData.workingLocation}
                </span>
              ) : (
                ""
              )}
              {workData.skill.map((skill, index) => (
                <span
                  key={index}
                  style={{ cursor: "default" }}
                  className={styles["tag-responsive"]}
                >
                  {skill.name}
                </span>
              ))}
              {workData.level.map((level, index) => (
                <span
                  key={index}
                  style={{ cursor: "default" }}
                  className={styles["tag-responsive"]}
                >
                  {level.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link to={`positions/${workData.id}`} target="_blank">
          <Button
            className={styles["apply-btn"]}
            style={{
              color: "#FFFFFF",
              backgroundColor: "#00b14f",
              width: 92,
              height: 28,
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
            }}
          >
            Ứng tuyển
          </Button>
        </Link>
        <div className={styles["end-date"]}>{workData.endDate}</div>
      </div>
    </Card>
  );
}

export default Position;
