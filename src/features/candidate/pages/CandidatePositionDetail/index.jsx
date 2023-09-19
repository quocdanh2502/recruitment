import {
  BookOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ClockCircleOutlined from "@ant-design/icons/lib/icons/ClockCircleOutlined";
import { Button, Card, Col, Row, Divider, FloatButton, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate, useParams } from "react-router-dom";
import ApplyForm from "./ApplyForm";
import "./CandidatePositionDetail.scss";
import candidateApi from "api/candidateApi";
import dayjs from "dayjs";

export default function CandidatePositionDetail() {
  const navigate = useNavigate();
  const { positionID } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.currentUser);
  const userID = user && user.id;

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const fetchData = async () => {
      return candidateApi.getVacancyById(positionID);
    };
    fetchData()
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        navigate("/404");
        console.log(error);
      });
  }, [positionID, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <Spin size="large"></Spin>
        </div>
      ) : (
        <div className="CandidatePositionDetail container">
          <div className="leftBodyContainer">
            <Card className="infoCompany">
              <div className="jobInfo">
                <h1>Tập đoàn FPT</h1>
                <h2>{data.position.name}</h2>
                <div className="jobDeadline">
                  <ClockCircleOutlined style={{ paddingRight: 5 }} />
                  Deadline for application:{" "}
                  {dayjs(data.endDate).format("DD/MM/YYYY")}
                </div>
              </div>
              
            </Card>
            <Card className="jobInformation">
              <Divider orientation="left" orientationMargin="10">
                <h4>JOB INFORMATION</h4>
              </Divider>
              <Row>
                <Col flex="12">
                  <ul>
                    <li>
                      <UserOutlined style={{ paddingRight: 10 }} />
                      Số lượng cần tuyển: {data.totalNeeded}
                    </li>
                    <li>
                      <BookOutlined style={{ paddingRight: 10 }} />
                      Loại hình công việc: Full Time
                    </li>
                  </ul>
                </Col>
                <Col flex="12">
                  <ul>
                    <li>
                      <HomeOutlined style={{ paddingRight: 10 }} />
                      Đơn vị quản lý:{" "}
                      {data.working_location == null
                        ? "no data"
                        : data.working_location.split(":")[0]}
                    </li>
                    <li>
                      <DollarOutlined style={{ paddingRight: 10 }} />
                      Mức lương: {data.salary + " VND"}
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card>
            <Card className="jobDetails">
              <Divider orientation="left" orientationMargin="10">
                <h4>JOB DESCRIPTION</h4>
              </Divider>
              <ul>
                <li>{data.description}</li>
              </ul>
              <Divider orientation="left" orientationMargin="10">
                <h4>JOB REQUIREMENTS</h4>
              </Divider>
              <ul>
                <li>{data.requirements}</li>
              </ul>

              {/* {viewCandidatePositionDetail.jobRequirements
                  .split("\n")
                  .map((item, key) => {
                    return (
                      <li key={key}>
                        <p>{item}</p>
                      </li>
                    );
                  })}
              </ul> */}
              <Divider orientation="left" orientationMargin="10">
                <h4>JOB BENEFIT</h4>
              </Divider>
              <ul>
                <li>{data.benefits}</li>
                {/* {viewCandidatePositionDetail.benefits
                  .split("\n")
                  .map((item, key) => {
                    return (
                      <li key={key}>
                        <p>{item}</p>
                      </li>
                    );
                  })} */}
              </ul>
              <Divider orientation="left" orientationMargin="10">
                <h4>REFERENCES</h4>
              </Divider>
              <ol>
                <li>
                  Nộp hồ sơ qua emai: Bạn chỉ cần điền đầy đủ th&ocirc;ng tin
                  c&aacute; nh&acirc;n&nbsp;v&agrave; gửi tới email&nbsp;
                  {data.recruiter.email
                    ? data.recruiter.email
                    : "abcd@gmail.com"}
                  ,&nbsp;ti&ecirc;u đề email v&agrave; t&ecirc;n file
                  đ&iacute;nh k&egrave;m c&oacute; định dạng &ldquo;Vi tri tuyen
                  dung_Noi lam viec_Ho va ten&quot;
                </li>
                <li>Thong tin chi tiet lien he: {data.referenceInformation}</li>
                <li>
                  Nộp hồ sơ trực tiếp tại trụ sở FPT Telecom :{" "}
                  {data.workingLocation}
                </li>
                <li>
                  H&ocirc;̀ sơ&nbsp;
                  <strong>photo kh&ocirc;ng c&acirc;̀n c&ocirc;ng chứng</strong>
                  &nbsp;g&ocirc;̀m:
                </li>
              </ol>
              <ul>
                <li>CMND và h&ocirc;̣ kh&acirc;̉u</li>
                <li>Bằng c&acirc;́p, chứng chỉ</li>
                <li>Sơ y&ecirc;́u lý lịch</li>
                <li>Số điện thoại li&ecirc;n h&ecirc;̣</li>
                <li>
                  Lưu &yacute;: C&ocirc;ng ty kh&ocirc;ng ho&agrave;n trả hồ sơ
                  v&agrave; chỉ li&ecirc;n hệ với ứng vi&ecirc;n đạt y&ecirc;u
                  cầu
                </li>
              </ul>
            </Card>
            <Card className="contactInformation">
              <h4>CONTACT INFORMATION</h4>
              <Row>
                <Col flex={5}>
                  <ul>
                    <li>Th&#244;ng tin li&#234;n hệ:</li>
                    <li>Email:</li>
                    <li>Điện thoại di động:</li>
                  </ul>
                </Col>
                <Col flex={5}>
                  <ul>
                    <li>
                      {data.recruiter.firstName + " " + data.recruiter.lastName}
                    </li>
                    <li>
                      {data.recruiter.email === ""
                        ? data.recruiter.email
                        : "abcd@email.com"}
                    </li>
                    <li>{data.recruiter.phoneNumber}</li>
                  </ul>
                </Col>
              </Row>
            </Card>
          </div>
          <Row className="moreInformation">
            <Col span={12} style={{ display: "flex" }}>
              <Card
                title="TẬP ĐOÀN FPT"
                className="companyCard"
                style={{ color: "#fff" }}
              >
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus, omnis
                voluptas assumenda est, omnis dolor repellendus. Temporibus
                autem qis doloribus asperiores repellat.
              </Card>
            </Col>
            <Col span={12} style={{ display: "flex" }}>
              <Card title="Related Jobs" className="relatedJobs">
                <ul>
                  <li>
                    {data.position.name}
                    <br></br>{" "}
                    <EnvironmentOutlined style={{ color: "#f27024" }} />{" "}
                    {data.working_location == null
                      ? "no data"
                      : data.working_location.split(":")[0]}
                  </li>
                  <li>
                    {data.position.name}
                    <br></br>{" "}
                    <EnvironmentOutlined style={{ color: "#f27024" }} />{" "}
                    {data.working_location == null
                      ? "no data"
                      : data.working_location.split(":")[0]}
                  </li>
                  <li>
                    {data.position.name}
                    <br></br>{" "}
                    <EnvironmentOutlined style={{ color: "#f27024" }} />{" "}
                    {data.working_location == null
                      ? "no data"
                      : data.working_location.split(":")[0]}
                  </li>
                  <li>
                    {data.position.name}
                    <br></br>{" "}
                    <EnvironmentOutlined style={{ color: "#f27024" }} />{" "}
                    {data.working_location == null
                      ? "no data"
                      : data.working_location.split(":")[0]}
                  </li>
                </ul>
              </Card>
            </Col>
            <FloatButton
              description="APPLY NOW"
              className="applyButton"
              onClick={showModal}
            ></FloatButton>
            <FloatButton.BackTop></FloatButton.BackTop>
          </Row>

          <ApplyForm
            userID={userID}
            visible={isModalOpen}
            setVisible={setIsModalOpen}
            positionId={positionID}
          />
        </div>
      )}
    </>
  );
}
