import {useContext} from "react";
import {MyOrderContext} from "../../utils/contexts/MyOrderContext";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import {
  CreditCardOutlined,
  QrcodeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./Order.css";
const Order = () => {
  const {cart, dispatch} = useContext(MyOrderContext);
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleUpdateToCart = (id, quantity) => {
    const qty = parseInt(quantity);
    if (qty > 0) {
      dispatch({
        type: "UPDATE_TO_CART",
        payload: {
          id: id,
          quantity: qty,
        },
      });
    } else {
      Alert("Số lượng phải lớn hơn 0");
    }
  };

  const handleRemoveFromCart = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món này khỏi giỏ hàng?")) {
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: {
          id: id,
        },
      });
    }
  };

  const handleCheckout = (paymentMethod) => {
    // Tùy vào phương thức mà bạn sẽ gọi API tương ứng
    switch (paymentMethod) {
      case "CASH":
        alert(
          "Thanh toán Tiền mặt: Đặt hàng thành công! Vui lòng chuẩn bị tiền mặt khi nhận hàng.",
        );
        // Gửi API tạo đơn hàng (Status: PENDING)
        break;
      case "MOMO":
        alert("Chuyển hướng đến cổng thanh toán MoMo...");
        // Gọi API lấy link thanh toán MoMo và window.location.href = link
        break;
      case "ZALOPAY":
        alert("Chuyển hướng đến cổng thanh toán ZaloPay...");
        // Gọi API lấy link thanh toán ZaloPay
        break;
      default:
        break;
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 fw-bold" style={{color: "#2c3e50"}}>
        Giỏ hàng của bạn{" "}
        <span className="text-muted fs-5">({cart ? cart.length : 0} món)</span>
      </h2>

      {cart && cart.length > 0 ? (
        <Row className="g-4">
          {/* CỘT TRÁI: DANH SÁCH MÓN ĂN */}
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cart.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm rounded-4 p-3 cart-item-card"
                >
                  <Row className="align-items-center text-center text-md-start">
                    {/* Ảnh món ăn */}
                    <Col xs={12} md={2} className="mb-3 mb-md-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="rounded-3 shadow-sm w-100"
                        style={{height: "90px", objectFit: "cover"}}
                      />
                    </Col>

                    {/* Thông tin tên và giá */}
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                      <h5
                        className="fw-bold mb-1 text-truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h5>
                      <span className="text-muted fw-semibold">
                        {item.price.toLocaleString()} ₫
                      </span>
                    </Col>

                    {/* Bộ điều khiển số lượng (Tự viết CSS riêng) */}
                    <Col
                      xs={6}
                      md={3}
                      className="d-flex justify-content-center justify-content-md-start"
                    >
                      <div className="d-flex align-items-center bg-light rounded-pill p-1 border">
                        <Button
                          variant="outline-secondary"
                          className="btn-qty border-0"
                          onClick={() =>
                            handleUpdateToCart(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="number"
                          className="qty-input text-center fw-bold fs-5 px-0"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateToCart(item.id, e.target.value)
                          }
                        />
                        <Button
                          variant="outline-secondary"
                          className="btn-qty border-0"
                          onClick={() =>
                            handleUpdateToCart(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </Col>

                    {/* Thành tiền và Nút Xóa */}
                    <Col
                      xs={6}
                      md={3}
                      className="d-flex justify-content-between justify-content-md-end align-items-center"
                    >
                      <span className="text-danger fw-bold fs-5 me-md-3">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </span>
                      <Button
                        variant="light"
                        className="text-danger rounded-circle p-2 border-0 shadow-sm"
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Xóa món"
                      >
                        <i className="fas fa-trash-alt"></i> 🗑️
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Col>

          {/* CỘT PHẢI: TỔNG KẾT VÀ THANH TOÁN */}
          <Col lg={4}>
            <Card className="border-0 shadow-lg summary-card p-4">
              <h4 className="fw-bold mb-4 border-bottom pb-3">Tổng đơn hàng</h4>

              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Tạm tính:</span>
                <span className="fw-semibold">{total.toLocaleString()} ₫</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Phí dịch vụ:</span>
                <span className="fw-semibold text-success">Miễn phí</span>
              </div>

              <hr className="my-3 text-muted" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold fs-5 text-dark">Tổng cộng:</span>
                <span className="text-danger fw-bolder fs-3">
                  {total.toLocaleString()} ₫
                </span>
              </div>

              <Dropdown className="d-grid">
                <Dropdown.Toggle
                  size="medium"
                  className="rounded-pill fw-bold text-white btn-checkout shadow border-0"
                  id="dropdown-payment"
                >
                  ĐẶT HÀNG NGAY
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="w-100 shadow-lg border-0 rounded-4 mt-2 p-2"
                  style={{zIndex: 9999}}
                >
                  <Dropdown.Item
                    onClick={() => handleCheckout("CASH")}
                    className="py-3 rounded-3 fw-semibold text-dark mb-1 d-flex align-items-center"
                  >
                    <WalletOutlined /> Tiền mặt
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => handleCheckout("MOMO")}
                    className="py-3 rounded-3 fw-semibold mb-1 d-flex align-items-center"
                    style={{
                      color: "#a50064",
                    }} /* Màu tím hồng đặc trưng của MoMo */
                  >
                    <CreditCardOutlined /> Ví điện tử MoMo
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => handleCheckout("ZALOPAY")}
                    className="py-3 rounded-3 fw-semibold text-primary d-flex align-items-center"
                  >
                    <QrcodeOutlined /> Ví ZaloPay
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className="text-center mt-3 text-muted small">
                <i className="fas fa-shield-alt"></i> Thanh toán an toàn & bảo
                mật
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        /* TRẠNG THÁI GIỎ HÀNG TRỐNG */
        <div className="text-center py-5 bg-white shadow-sm rounded-4 border">
          <div className="mb-4" style={{fontSize: "5rem"}}>
            🛒
          </div>
          <h4 className="text-muted mb-3 fw-bold">
            Giỏ hàng của bạn đang trống
          </h4>
          <p className="text-secondary mb-4">
            Có vẻ như bạn chưa chọn món ăn nào. Hãy khám phá thực đơn ngay nhé!
          </p>
          <Button
            variant="success"
            size="lg"
            href="/"
            className="rounded-pill px-5 fw-bold shadow-sm"
          >
            Quay lại Thực đơn
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Order;
