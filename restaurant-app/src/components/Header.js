import { useContext, useEffect, useState, useRef } from "react";
import Apis, { endpoints } from "../configs/Apis";
import {
  Badge,
  Button,
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyOrderContext } from "../utils/contexts/MyOrderContext";
import { MyUserContext } from "../utils/contexts/MyUserContext";
import { MyCompareContext } from "../utils/contexts/MyCompareContext";
import MySpinner from "../components/MySpinner";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const Header = () => {
  const { totalQuantity } = useContext(MyOrderContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(MyUserContext);
  const [compareList, compareDispatch] = useContext(MyCompareContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const unreadListenerRef = useRef(null);
  // const [kw, setKw] = useState("");
  const nav = useNavigate();

  const loadCategories = async () => {
    setLoading(true);
    try {
      let res = await Apis.get(endpoints["categories"]);
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = (userId) => {
    if (!userId) return;

    // Cleanup previous listener
    if (unreadListenerRef.current) {
      off(unreadListenerRef.current);
    }

    const unreadRef = ref(database, `unread/${userId}`);
    unreadListenerRef.current = unreadRef;

    onValue(unreadRef, (snapshot) => {
      const data = snapshot.val();
      setUnreadCount(data || 0);
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (user) {
      loadUnreadCount(user.id);
    }

    return () => {
      // Cleanup listener on unmount
      if (unreadListenerRef.current) {
        off(unreadListenerRef.current);
      }
    };
  }, [user]);

  // const search = (e) => {
  //   e.preventDefault();
  //   nav(`/?kw=${kw}`);
  // };

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="shadow-sm sticky-top py-3 border-bottom"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-3 d-flex align-items-center gap-2"
          style={{ color: "#27ae60" }}
        >
          <span>eRestaurant</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Danh sách các loại món ăn (Nằm giữa) */}
          <Nav className="mx-auto fw-semibold align-items-lg-center">
            <Nav.Link as={Link} to="/" className="px-3 text-dark">
              Tất cả món
            </Nav.Link>

            {categories.map((c) => (
              <Nav.Link
                key={c.id}
                as={Link}
                to={`/?cateId=${c.id}`}
                className="px-3 text-secondary"
              >
                {c.name}
              </Nav.Link>
            ))}
          </Nav>

          <div className="d-flex align-items-center mt-3 mt-lg-0 gap-3 flex-wrap">
            <Button
              variant="outline-warning"
              onClick={() => nav("/reservation")}
              className="rounded-pill px-3 fw-bold shadow-sm"
            >
              Đặt bàn
            </Button>
            {user && (
              <Button
                variant="outline-info"
                onClick={() => nav("/chat")}
                className="rounded-pill px-3 fw-bold shadow-sm position-relative"
              >
                Tin nhắn
                {unreadCount > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button
              variant="outline-primary"
              onClick={() => nav("/compare")}
              className="rounded-pill px-3 fw-bold shadow-sm position-relative"
            >
              So sánh
              {compareList.length > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                >
                  {compareList.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline-success"
              onClick={() => nav("/order")}
              className="rounded-pill px-4 fw-bold shadow-sm"
            >
              Giỏ hàng ({totalQuantity})
            </Button>
            {user ? (
              <Button
                onClick={() => nav("/profile")}
                variant="success"
                className="rounded-pill px-3 fw-bold text-white d-flex align-items-center gap-2 shadow-sm"
              >
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="rounded-circle bg-white p-1"
                  style={{
                    width: "34px",
                    height: "34px",
                    objectFit: "cover",
                  }}
                />
                <span>{user.username}</span>
              </Button>
            ) : (
              <Button
                onClick={() => nav("/login")}
                variant="success"
                className="rounded-pill px-4 fw-bold text-white shadow-sm"
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

export default Header;
