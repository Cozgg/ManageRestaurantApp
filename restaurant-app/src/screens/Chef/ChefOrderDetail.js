import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import cookies from "react-cookies";
import {authApis, endpoints} from "../../configs/Apis";
import {message} from "antd";
import MySpinner from "../../components/MySpinner";
import {Badge, Button, Card, Col, Container, Image, Row} from "react-bootstrap";
const ChefOrderDetail = () => {
  const params = useParams();
  const orderId = params.orderId;
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const order = orderData?.order;
  const items = orderData?.items || [];

  const loadOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const token = cookies.load("token");
      const res = await authApis(token).get(
        endpoints["chef-order-detail"](orderId),
      );
      console.log(res.data);
      setOrderData(res.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi lấy chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOrderDetail(orderId);
  }, [orderId]);
  return (
    <>
      {loading === true || !orderData || !orderData.order ? (
        <div className="text-center py-5">
          <MySpinner />
        </div>
      ) : (
        <Container className="my-4" style={{maxWidth: "950px"}}>
          {/* Back button */}
          <Button
            variant="link"
            as={Link}
            to="/chef-orders"
            className="text-decoration-none text-secondary mb-3 p-0 fw-semibold"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại danh sách đơn
          </Button>

          {/* Main card */}
          <Card
            className="border-0 shadow-lg rounded-4 overflow-hidden"
            style={{
              background: "#ffffff",
            }}
          >
            {/* Header */}
            <Card.Header
              className="border-0 p-4"
              style={{
                background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h3 className="fw-bold mb-1 text-dark">
                    🍳 Phiếu chế biến #{order.id}
                  </h3>

                  <div className="text-muted">
                    {new Date(order.createdDate).toLocaleString("vi-VN")}
                  </div>
                </div>

                <Badge
                  bg="warning"
                  text="dark"
                  className="px-4 py-3 fs-6 rounded-pill shadow-sm"
                >
                  {items.length} món cần chuẩn bị
                </Badge>
              </div>
            </Card.Header>

            {/* Body */}
            <Card.Body className="p-4">
              {/* Order info */}
              <Row className="g-3 mb-4">
                <Col md={4}>
                  <Card
                    className="border-0 shadow-sm rounded-4 h-100"
                    style={{backgroundColor: "#f8fafc"}}
                  >
                    <Card.Body>
                      <div className="text-muted small mb-2">Khách hàng</div>

                      <div className="fw-bold fs-5 text-dark">
                        {order.user.lastName} {order.user.firstName}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card
                    className="border-0 shadow-sm rounded-4 h-100"
                    style={{backgroundColor: "#f8fafc"}}
                  >
                    <Card.Body>
                      <div className="text-muted small mb-2">Bàn</div>

                      <div className="fw-bold fs-5 text-dark">
                        #{order.reservationId || "Mang đi"}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card
                    className="border-0 shadow-sm rounded-4 h-100"
                    style={{backgroundColor: "#f8fafc"}}
                  >
                    <Card.Body>
                      <div className="text-muted small mb-2">Thanh toán</div>

                      <div className="fw-bold fs-5 text-primary">
                        {order.payment}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Dish title */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark">
                  Danh sách món cần chuẩn bị
                </h5>

                <Badge
                  bg="light"
                  text="dark"
                  className="border px-3 py-2 rounded-pill"
                >
                  Tổng số lượng:{" "}
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              </div>

              {/* Dish list */}
              <div className="d-flex flex-column gap-3">
                {items.map((item, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-sm rounded-4"
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <Card.Body className="p-3">
                      <Row className="align-items-center">
                        {/* Image */}
                        <Col xs={3} md={2}>
                          <Image
                            src={item.dishImage}
                            rounded
                            fluid
                            className="shadow-sm border"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </Col>

                        {/* Info */}
                        <Col xs={6} md={7}>
                          <h5 className="fw-bold mb-2 text-dark">
                            {item.dishName}
                          </h5>

                          <div className="text-muted mb-2">
                            Đơn giá: {item.unitPrice.toLocaleString("vi-VN")} ₫
                          </div>

                          <div className="small text-secondary">
                            Món đang chờ chế biến
                          </div>
                        </Col>

                        {/* Quantity */}
                        <Col xs={3} md={3} className="text-end">
                          <Badge
                            bg="light-blue"
                            className="px-4 py-3 fs-5 rounded-pill shadow-sm"
                          >
                            x{item.quantity}
                          </Badge>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4">
                <Card
                  className="border-0 shadow-sm rounded-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                >
                  <Card.Body>
                    <Row className="align-items-center text-center">
                      <Col md={4}>
                        <div className="text-muted small mb-2">Tổng món</div>

                        <div className="fw-bold fs-2 text-dark">
                          {items.reduce(
                            (total, item) => total + item.quantity,
                            0,
                          )}
                        </div>
                      </Col>

                      <Col md={4} className="border-start border-end">
                        <div className="text-muted small mb-2">Số loại món</div>

                        <div className="fw-bold fs-2 text-dark">
                          {items.length}
                        </div>
                      </Col>

                      <Col md={4}>
                        <div className="text-muted small mb-2">Giá trị đơn</div>

                        <div className="fw-bold fs-4 text-danger">
                          {order.totalPrice.toLocaleString("vi-VN")} ₫
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
};

export default ChefOrderDetail;
