import {useContext, useEffect, useState, useRef} from "react";
import Apis, {endpoints} from "../configs/Apis";
import {
  Badge,
  Button,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {MyOrderContext} from "../utils/contexts/MyOrderContext";
import {MyUserContext} from "../utils/contexts/MyUserContext";
import {MyCompareContext} from "../utils/contexts/MyCompareContext";
import MySpinner from "../components/MySpinner";
import {database} from "../firebaseConfig";
import {ref, onValue, off} from "firebase/database";
import "./Header.css";
const Header = () => {
  const {totalQuantity} = useContext(MyOrderContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(MyUserContext);
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
        {/* LOGO */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-3 d-flex align-items-center gap-2"
          style={{color: "#27ae60"}}
        >
          <span>eRestaurant</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* CATEGORY NAV */}
          <Nav className="mx-auto align-items-lg-center gap-lg-2">
            {/* ALL */}
            <Nav.Link
              as={NavLink}
              to="/"
              end
              className={({isActive}) =>
                `px-3 py-2 rounded-pill fw-semibold border-0 nav-category ${
                  isActive ? "nav-category-active" : "nav-category-inactive"
                }`
              }
            >
              🍽 Tất cả món
            </Nav.Link>

            {/* CATEGORY */}
            {categories.map((c) => (
              <Nav.Link
                key={c.id}
                as={NavLink}
                to={`/?cateId=${c.id}`}
                className={({isActive}) =>
                  `px-3 py-2 rounded-pill fw-medium border-0 nav-category ${
                    isActive ? "nav-category-active" : "nav-category-inactive"
                  }`
                }
              >
                {c.name}
              </Nav.Link>
            ))}
          </Nav>

          {/* RIGHT ACTIONS */}
          <div className="d-flex align-items-center mt-3 mt-lg-0 gap-2 flex-wrap">
            {/* FEATURE DROPDOWN */}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="rounded-pill px-3 border-0 shadow-sm fw-semibold"
                style={{
                  backgroundColor: "#f8fafc",
                }}
              >
                ⚡ Tiện ích
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow rounded-4 overflow-hidden">
                <Dropdown.Item
                  onClick={() => nav("/reservation")}
                  className="py-2"
                >
                  🍴 Đặt bàn
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => nav("/compare")}
                  className="py-2 position-relative"
                >
                  ⚖️ So sánh món ăn
                  {compareList.length > 0 && (
                    <Badge bg="danger" className="ms-2">
                      {compareList.length}
                    </Badge>
                  )}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* CHAT */}
            {user && (
              <Button
                variant="light"
                onClick={() => nav("/chat")}
                className="rounded-pill px-3 border-0 shadow-sm fw-semibold position-relative"
                style={{
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                💬 Chat
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

            {/* CART */}
            <Button
              onClick={() => nav("/order")}
              className="cart-btn border-0 d-flex align-items-center"
            >
              <div className="cart-icon-wrapper">
                <span className="cart-icon">🛒</span>

                {totalQuantity > 0 && (
                  <span className="cart-badge">{totalQuantity}</span>
                )}
              </div>

              <span className="cart-text">Giỏ hàng</span>
            </Button>

            {/* PROFILE */}
            {user ? (
              <Button
                onClick={() => nav("/profile")}
                className="profile-btn border-0 d-flex align-items-center"
              >
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="profile-avatar"
                />

                <span className="profile-name">{user.username}</span>
              </Button>
            ) : (
              <Button
                onClick={() => nav("/login")}
                className="login-btn border-0"
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
