import {useContext} from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import "./Chef.css";
import {MyOrderSocketContext} from "../../utils/contexts/MyOrderSocketContext";
const ChefHeader = () => {
  const {user} = useContext(MyUserContext);
  const {unreadCount} = useContext(MyOrderSocketContext);

  // const [kw, setKw] = useState("");
  const nav = useNavigate();

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="chef-navbar shadow-sm sticky-top border-bottom py-3"
    >
      <Container>
        {/* LOGO */}
        <Navbar.Brand
          as={Link}
          to="/chef"
          className="fw-bold fs-3 d-flex align-items-center gap-2"
          style={{color: "#27ae60"}}
        >
          <span>eRestaurant</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="chef-navbar"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="chef-navbar">
          {/* CENTER NAV */}
          <Nav className="mx-auto gap-3 align-items-lg-center my-3 my-lg-0">
            {/* DISH */}
            <Button as={Link} to="/chef" className="chef-nav-btn border-0">
              <i className="fas fa-utensils"></i>

              <span>Quản lý món ăn</span>
            </Button>

            {/* ORDER */}
            <Button
              as={Link}
              to="/chef-profile"
              className="chef-nav-btn border-0"
            >
              <i className="fas fa-receipt"></i>

              <span>Đơn hàng</span>
            </Button>

            {/* SOCKET */}
            <Button
              className="chef-realtime-btn border-0"
              onClick={() => nav("/realtime-orders")}
            >
              <span className="live-dot"></span>
              <span>Realtime Orders</span>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Nav>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <Button
                onClick={() => nav("/chef-profile")}
                className="chef-profile-btn border-0"
              >
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="chef-profile-avatar"
                />

                <div className="d-flex flex-column text-start lh-sm">
                  <span className="chef-profile-name">{user.username}</span>

                  <small className="chef-profile-role">Chef</small>
                </div>
              </Button>
            ) : (
              <Button
                onClick={() => nav("/login")}
                className="chef-login-btn border-0"
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ChefHeader;
