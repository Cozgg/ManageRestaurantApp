import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {authApis, endpoints} from "../../configs/Apis";
import cookies from "react-cookies";
import {message} from "antd";
import {Badge, Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
const OrderDetail = () => {
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
      const res = await authApis(token).get(endpoints["order-detail"](orderId));
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
        <Container className="my-5" style={{maxWidth: "700px"}}>
          <Button
            variant="link"
            as={Link}
            to="/profile"
            className="text-decoration-none mb-3 p-0 text-muted"
          >
            <i className="fas fa-arrow-left me-2"></i> Quay lại lịch sử
          </Button>

          <Card className="shadow-lg border-0 rounded-4">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0 text-dark">Đơn hàng #{order.id}</h4>
                <Badge
                  bg={order.statusPay === "COMPLETED" ? "success" : "warning"}
                  className="px-3 py-2 rounded-pill fs-6 shadow-sm"
                >
                  {order.statusPay}
                </Badge>
              </div>

              <Row className="text-muted fs-6 bg-light p-3 rounded-3 mb-4 mx-0 shadow-sm">
                <Col sm={6} className="mb-2 mb-sm-0">
                  <div className="mb-1">
                    <strong>Ngày đặt:</strong>{" "}
                    {new Date(order.createdDate).toLocaleString("vi-VN")}
                  </div>
                  <div>
                    <strong>Mã bàn:</strong> #{order.reservationId || "Trống"}
                  </div>
                </Col>
                <Col sm={6}>
                  <div>
                    <strong>Thanh toán:</strong>{" "}
                    <span className="text-primary fw-semibold">
                      {order.payment}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className="px-4 pb-4">
              <h5 className="fw-bold mb-3 text-secondary">Chi tiết món ăn</h5>

              <div className="d-flex flex-column gap-3 mb-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center p-3 border rounded-3 bg-white shadow-sm hover-shadow transition"
                  >
                    <Image
                      src={item.dishImage}
                      rounded
                      style={{
                        width: "75px",
                        height: "75px",
                        objectFit: "cover",
                      }}
                      className="me-3 border"
                    />
                    <div className="flex-grow-1 pt-1 pl-2">
                      <h6 className="fw-bold mb-1 text-dark">
                        {item.dishName}
                      </h6>
                      <span className="text-muted small fw-medium">
                        {item.quantity} x{" "}
                        {item.unitPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="fw-bold text-danger fs-5">
                      {(item.quantity * item.unitPrice).toLocaleString("vi-VN")}{" "}
                      ₫
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3 d-flex justify-content-between align-items-center mt-2">
                <span className="fw-bold fs-5 text-dark">Tổng thanh toán:</span>
                <span className="text-danger fw-bolder fs-3">
                  {order.totalPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
};

export default OrderDetail;
