import {useContext, useEffect, useState} from "react";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import cookies from "react-cookies";
import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Container, Image, Row, Table} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import {authApis, endpoints} from "../../configs/Apis";
const Profile = () => {
  const {user, dispatch} = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const nav = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = cookies.load("token");
      let res = await authApis(token).get(endpoints["get-orders"]);
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);
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
    <Container className="my-5">
      {!user && <MySpinner />}

      <Row className="g-4">
        <Col lg={4} md={5}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body className="p-4 text-center d-flex flex-column">
              <h4 className="fw-bold mb-4 text-success">Thông tin cá nhân</h4>

              <div className="d-flex justify-content-center mb-3">
                <Image
                  src={user.avatar || "https://via.placeholder.com/150"}
                  roundedCircle
                  className="border border-3 border-success p-1 shadow-sm"
                  style={{width: "130px", height: "130px", objectFit: "cover"}}
                />
              </div>

              <h5 className="fw-bold mb-1">
                {user.firstName} {user.lastName}
              </h5>
              <p className="text-muted mb-4">@{user.username}</p>

              <div className="bg-light p-3 rounded-3 text-start mb-auto">
                <Row className="mb-2">
                  <Col xs={5} className="text-muted fw-semibold">
                    Vai trò:
                  </Col>
                  <Col xs={7} className="fw-bold">
                    {user.userRole === "ROLE_CHEF"
                      ? "Đầu bếp"
                      : user.userRole === "ROLE_USER"
                        ? "Khách hàng"
                        : "Quản trị viên"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={5} className="text-muted fw-semibold">
                    Điện thoại:
                  </Col>
                  <Col xs={7} className="fw-bold">
                    {user.phone || "Chưa cập nhật"}
                  </Col>
                </Row>
              </div>

              <Button
                variant="outline-danger"
                className="w-100 rounded-pill fw-bold mt-4"
                onClick={logout}
              >
                Đăng xuất
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} md={7}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body className="p-4">
              {user.userRole === "ROLE_CHEF" ? (
                <h4 className="fw-bold mb-4" style={{color: "#2c3e50"}}>
                  Lịch sử đặt món
                </h4>
              ) : (
                <h4 className="fw-bold mb-4" style={{color: "#2c3e50"}}>
                  Lịch sử giao dịch
                </h4>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <MySpinner />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle border-top">
                    <thead className="table-light text-muted">
                      <tr>
                        <th>Mã Đơn</th>
                        <th>Ngày đặt</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th className="text-end">Tổng tiền</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading === true ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <MySpinner />
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          {user.userRole === "ROLE_CHEF" ? (
                            <td
                              colSpan="6"
                              className="text-center py-4 text-muted"
                            >
                              Bạn chưa có đơn hàng nào.
                            </td>
                          ) : (
                            <td
                              colSpan="6"
                              className="text-center py-4 text-muted"
                            >
                              Bạn chưa có giao dịch nào.
                            </td>
                          )}
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id}>
                            <td className="fw-bold">#{order.id}</td>

                            <td>
                              {new Date(order.createdDate).toLocaleString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </td>

                            <td>{order.payment}</td>

                            <td>
                              <span
                                className={`badge ${
                                  order.statusPay === "COMPLETED"
                                    ? "bg-success"
                                    : order.statusPay === "PENDING"
                                      ? "bg-warning text-dark"
                                      : "bg-danger"
                                }`}
                              >
                                {order.statusPay}
                              </span>
                            </td>

                            <td className="text-end fw-semibold text-danger">
                              {order.totalPrice.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="text-center align-middle">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill fw-semibold px-3 shadow-sm"
                                onClick={() => nav(`/order-detail/${order.id}`)}
                              >
                                <i className="fas fa-eye me-1"></i> Chi tiết
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
