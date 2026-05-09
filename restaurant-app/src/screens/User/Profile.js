import {useContext, useEffect, useState} from "react";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import cookies from "react-cookies";
import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
const Profile = () => {
  const {user, dispatch} = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const logout = () => {
    dispatch({
      type: "logout",
      payload: null,
    });
    cookies.remove("token");
    nav("/");
  };

  if (!user) {
    return (
      <Container className="mt-5 text-center">Đang tải dữ liệu...</Container>
    );
  }

  return (
    <Container className="my-5 d-flex justify-content-center">
      {!user && <MySpinner></MySpinner>}
      <Card
        className="shadow-lg border-0 rounded-4"
        style={{maxWidth: "600px", width: "100%"}}
      >
        <Card.Body className="p-4 text-center">
          <h2 className="fw-bold mb-4 text-success">Thông tin cá nhân</h2>

          <Image
            src={user.avatar || "https://via.placeholder.com/150"}
            roundedCircle
            className="mb-3 border border-3 border-success p-1"
            style={{width: "150px", height: "150px", objectFit: "cover"}}
          />

          <h3 className="fw-bold mb-1">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-muted fs-5 mb-4">@{user.username}</p>

          <div className="bg-light p-3 rounded-3 text-start mb-4">
            <Row className="mb-2">
              <Col xs={4} className="text-muted fw-semibold">
                Vai trò:
              </Col>
              <Col xs={8} className="fw-bold">
                {user.userRole === "ROLE_CHEF"
                  ? "Đầu bếp"
                  : user.userRole === "ROLE_USER"
                    ? "Khách hàng"
                    : user.userRole}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="text-muted fw-semibold">
                Điện thoại:
              </Col>
              <Col xs={8} className="fw-bold">
                {user.phone || "Chưa cập nhật"}
              </Col>
            </Row>
          </div>

          <Button
            variant="outline-danger"
            className="w-100 rounded-pill fw-bold"
            onClick={logout}
          >
            Đăng xuất
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
