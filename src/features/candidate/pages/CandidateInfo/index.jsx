import { authSelectors } from "features/auth/authSlice";
import { useSelector } from "react-redux";
import UserInfo from "../../../../components/Common/UserInfo/UserInfo";
import "./CandidateInfo.scss";
import { Skeleton } from "antd";


export default function CandidateInfo() {
  const { currentUser } = useSelector(authSelectors);

  return (
    <div className="CandidateInfo internal-container" style={{ display: "flex", justifyContent: "center" }}>
      {
        !currentUser ? (
          <Skeleton active />
        ) : (
          <UserInfo
            data={currentUser}
            role={"candidate"}
            color={"#3ee0a5"}
            bgColor={"#f6fffc"}
            justView={false}
          />
        )
      }
    </div>
  );
}
