import {Outlet} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {Container} from "react-bootstrap";

const MainLayout = () => {
  return (
    <>
      <Header />

      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
