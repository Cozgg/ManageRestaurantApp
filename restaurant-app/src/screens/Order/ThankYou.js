import React, {useContext, useEffect, useState} from "react";
import {useSearchParams, Link} from "react-router-dom";
import {Container, Button, Card, Row, Col} from "react-bootstrap";
import "./ThankYou.css";
import {MyOrderContext} from "../../utils/contexts/MyOrderContext";
import {message} from "antd";
import cookies from "react-cookies";
import {authApis, endpoints} from "../../configs/Apis";
const ThankYou = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [orderId, setOrderId] = useState("...");
  const [totalAmount, setTotalAmount] = useState("...");
  const [paymentMethod, setPaymentMethod] = useState("...");
  const {dispatch} = useContext(MyOrderContext);

  const loadOrderDetail = async (id) => {
    try {
      const token = cookies.load("token");
      let res = await authApis(token).get(endpoints["order-detail"](id));
      const order = res.data;

      setTotalAmount(order.totalPrice);
      setPaymentMethod(order.payment);
    } catch (error) {
      message.error("Lỗi lấy chi tiết đơn hàng");
      console.log(error);
    }
  };

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const rawId = searchParams.get("orderId");

    if (rawId) {
      const realId = rawId.split("_")[0];
      setOrderId(realId);
      loadOrderDetail(realId);
    }
    if (resultCode === "0") {
      setStatus("success");
      dispatch({type: "CLEAR_CART"});
      setTotalAmount(970000);
      setPaymentMethod("Ví điện tử MoMo");
    } else if (resultCode) {
      setStatus("error");
    } else {
      setStatus("success");
      setPaymentMethod("Tiền mặt khi nhận hàng");
    }
  }, [searchParams, dispatch]);

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        {/* THANH HEADER ĐƠN GIẢN */}
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <h2 className="fw-bold m-0" style={{color: "#198754"}}>
            eRestaurant
          </h2>
          <span className="text-muted fw-semibold">
            Giao dịch an toàn & bảo mật
          </span>
        </div>

        <div className="d-flex justify-content-center">
          <Card
            className="shadow-lg border-0 rounded-4"
            style={{maxWidth: "650px", width: "100%"}}
          >
            <Card.Body className="p-md-5 p-4 text-center">
              {/* --- GIAO DIỆN THÀNH CÔNG --- */}
              {status === "success" && (
                <>
                  <div className="success-icon-container shadow-sm border border-success border-opacity-10">
                    <i className="fas fa-check-circle"></i>{" "}
                    {/* Bạn cần FontAwesome/Icon để hiển thị i này */}
                  </div>
                  <h1 className="fw-bolder mb-2" style={{color: "#2c3e50"}}>
                    Đặt hàng thành công!
                  </h1>
                  <p className="text-muted mb-5 fs-5">
                    Cảm ơn bạn đã tin tưởng. Bếp đang bắt đầu chuẩn bị món ăn
                    ngay nhé.
                  </p>

                  {/* CHI TIẾT ĐƠN HÀNG */}
                  <div className="details-box text-start mb-5 border shadow-sm">
                    <Row className="mb-3">
                      <Col xs={5} className="text-muted fw-semibold">
                        Mã đơn hàng:
                      </Col>
                      <Col xs={7} className="fw-bold text-dark text-break">
                        #{orderId}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={5} className="text-muted fw-semibold">
                        Tổng thanh toán:
                      </Col>
                      <Col xs={7} className="fw-bolder text-danger fs-5">
                        {typeof totalAmount === "number"
                          ? totalAmount.toLocaleString()
                          : "..."}{" "}
                        ₫
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={5} className="text-muted fw-semibold">
                        Phương thức:
                      </Col>
                      <Col xs={7} className="fw-semibold text-success">
                        {paymentMethod}
                      </Col>
                    </Row>
                  </div>
                </>
              )}

              {/* --- GIAO DIỆN THẤT BẠI / HỦY --- */}
              {status === "error" && (
                <>
                  <div className="error-icon-container shadow-sm border border-danger border-opacity-10">
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <h1 className="fw-bolder mb-2 text-danger">
                    Giao dịch chưa hoàn tất
                  </h1>
                  <p className="text-muted mb-4 fs-5">
                    Có vẻ như bạn đã hủy giao dịch hoặc có lỗi xảy ra. Đừng lo,
                    bạn có thể thử lại.
                  </p>
                  <div className="text-start bg-light p-3 rounded-3 mb-5 text-muted small border">
                    <strong>Lưu ý:</strong> Đơn hàng #{orderId} hiện chưa được
                    thanh toán thành công.
                  </div>
                </>
              )}

              {/* --- GIAO DIỆN CHỜ --- */}
              {status === "loading" && (
                <div className="py-5">
                  <div
                    className="spinner-border text-success mb-3"
                    style={{width: "3rem", height: "3rem"}}
                    role="status"
                  ></div>
                  <h4 className="text-muted">
                    Đang xác nhận kết quả giao dịch...
                  </h4>
                </div>
              )}

              {/* HÀNH ĐỘNG TIẾP THEO (CALL TO ACTIONS) */}
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Button
                    as={Link}
                    to="/"
                    variant="outline-success"
                    size="lg"
                    className="w-100 rounded-pill fw-bold"
                  >
                    Tiếp tục mua sắm
                  </Button>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    as={Link}
                    to="/order-history"
                    size="lg"
                    className="w-100 rounded-pill fw-bold text-white btn-checkout-history shadow"
                  >
                    Xem lịch sử đơn
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-5 text-muted small pt-3 border-top">
          eRestaurant | Đội ngũ hỗ trợ: 1900 xxxx | Phản hồi dịch vụ
        </div>
      </Container>
    </div>
  );
};

export default ThankYou;
