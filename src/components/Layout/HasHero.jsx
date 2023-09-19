import { Layout, Typography } from "antd";
import city from "assets/images/city.webp";
import { Outlet } from "react-router-dom";
import "./Layout.scss";

export default function HasHero() {
  return (
    <>
      <Layout className="HasHero" style={{ backgroundImage: `url(${city})` }}>
        <Typography.Text>OUR MISSION IS ...</Typography.Text>
      </Layout>
      <Outlet />
    </>
  );
}
