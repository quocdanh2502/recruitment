import { Descriptions, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;

export default function DescriptionInterview(props) {
  const { interviewDetail } = props;
  const [interview, setInterview] = useState({
    vacancy: "...",
    firstName: "...",
    lastName: "...",
    birthday: "...",
    phoneNumber: "...",
    address: "...",
    email: "...",
    applyDate: "...",
    cvId: null,
    interviewDateTime: "...",
    recruiter: "...",
    interviewer: "...",
    status: "...",
  });

  useEffect(() => {
    if (interviewDetail)
      setInterview({
        vacancy: interviewDetail.candidateVacancy.vacancy.description,
        firstName: interviewDetail.candidateVacancy.candidate.firstName,
        lastName: interviewDetail.candidateVacancy.candidate.lastName,
        birthday: interviewDetail.candidateVacancy.candidate.birthday,
        phoneNumber: interviewDetail.candidateVacancy.candidate.phoneNumber,
        email: interviewDetail.candidateVacancy.candidate.email,
        address: interviewDetail.candidateVacancy.candidate.address,
        applyDate: interviewDetail.candidateVacancy.applyDate,
        cvId: interviewDetail.candidateVacancy.cvId,
        interviewDateTime: interviewDetail.interviewDatetime,
        recruiter: interviewDetail.recruiter,
        interviewer: interviewDetail.interviewer,
        status: interviewDetail.status,
      });
  }, [interviewDetail]);

  return (
    <div className="DescriptionInterview">
      <Descriptions
        title={<Title level={3}>Interview Information</Title>}
        style={{ borderBottom: "#e5e5e5 0.1px solid" }}
      >
        <Descriptions.Item label="Vacancy">
          <Text strong>{interview.vacancy}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Recruiter">
          <Text strong>
            {interview.recruiter ? (
              <>
                {" "}
                {interview.recruiter.firstName} {interview.recruiter.lastName}
              </>
            ) : (
              "..."
            )}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Interviewer">
          <Text strong>
            {interview.interviewer ? (
              <>
                {" "}
                {interview.interviewer.firstName}{" "}
                {interview.interviewer.lastName}
              </>
            ) : (
              "..."
            )}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Text
            strong
            style={{
              color:
                (interview.status === "CANCELLED" && "#f5222d") ||
                (interview.status === "PENDING" && "#fa8c16") ||
                (interview.status === "COMPLETED" && "#5b8c00"),
            }}
          >
            {interview.status}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        style={{ padding: "1rem 0" }}
        title={<Title level={5}>Candidate Infomation</Title>}
      >
        <Descriptions.Item label="Name">
          {interview.firstName} {interview.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Resume">
          {interview.cvId ? (
            <Link to={`/view-resume?_interviewID=${interview.cvId}`} target="_blank">
              View CV
            </Link>
          ) : (
            "..."
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Telephone">
          {interview.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Birthday">
          {interview.birthday}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{interview.email}</Descriptions.Item>
        <Descriptions.Item label="Address">
          {interview.address && (
            <>
              {interview.address.street} Street, {interview.address.city} City,{" "}
              {interview.address.country}
            </>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Apply Time">
          {interview.applyDate}
        </Descriptions.Item>
        <Descriptions.Item label="Interview Time">
          {interview.interviewDateTime}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
