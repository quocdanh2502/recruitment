import { Col, List, Pagination, Row, Spin } from "antd";
import image1 from "assets/images/image-1.png";
import { Position, SearchJob } from "components/Common";
import {
  candidateActions,
  candidateSelectors,
} from "features/candidate/candidateSlice";
import { publicSelectors } from "features/public/publicSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CandidateHome.scss";

export default function CandidateHome() {
  const { currentVacancies } = useSelector(candidateSelectors);
  const { skills, levels } = useSelector(publicSelectors);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(1);
  const [searchData, setSearchData] = useState({ page: 1, limit: 5 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 880);

  const onChange = (page) => {
    const newParams = {
      ...currentVacancies.params,
      page: page,
    };
    fetchData(newParams);
    setCurrent(page);
  };

  const fetchData = useCallback(
    (params) => {
      dispatch(candidateActions.getVacancies(params));
    },
    [dispatch]
  );

  useEffect(() => {
    // Function to fetch Vacancies data
    if (!currentVacancies.status) fetchData({ ...searchData });
  }, [currentVacancies.status, fetchData, searchData]);

  const onSearch = function (data) {
    let params = { page: 1, limit: 5 }; // Bổ sung data vào params để ghi nhớ thông tin tìm kiếm
    if (data.q) {
      params = {
        q: data.q,
        ...params,
      };
    }
    if (data.levelIds.length > 0) {
      params = {
        levelIds: data.levelIds,
        ...params,
      };
    }
    if (data.skillIds.length > 0) {
      params = {
        skillIds: data.skillIds,
        ...params,
      };
    }
    setSearchData(params);
    fetchData(params);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 880);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="CandidateHomePage">
      {skills && skills.length > 0 && levels && levels.length > 0 && (
        <SearchJob onSearch={onSearch} skills={skills} levels={levels} />
      )}

      <>
        <Row gutter={8} className="container my-25">
          <Col span={isMobile ? 24 : 19} className="col-default">
            {(currentVacancies.status === "200" ||
              currentVacancies.status === "401") && (
              <List
                grid={{ gutter: [0, 8], column: 1 }}
                dataSource={currentVacancies.data}
                renderItem={(work) => (
                  <Position key={work.id} workData={work} />
                )}
              />
            )}
            {currentVacancies.status === "pending" && (
              <div className="loader">
                <Spin></Spin>
              </div>
            )}
          </Col>

          <Col span={isMobile ? 0 : 5}>
            <img src={image1} alt="" className="w-full"></img>
          </Col>
        </Row>
        <div className="pagination">
          <Pagination current={current} onChange={onChange} total={50} />
        </div>
      </>
    </div>
  );
}
