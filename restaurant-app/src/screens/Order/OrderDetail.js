import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import cookies from "react-cookies";
import { message } from "antd";
import { Alert, Badge, Button, Card, Col, Container, Form, Image, Modal, Row, Star } from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import { Star as StarIcon } from "lucide-react";
const OrderDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const orderId = params.orderId;
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const order = orderData?.order;
  const items = orderData?.items || [];

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [rating, setRating] = useState(5);
  const [ratingContent, setRatingContent] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [dishRatings, setDishRatings] = useState({});
  const [myRatings, setMyRatings] = useState({});
  const [err, setErr] = useState("");

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

  useEffect(() => {
    if (orderData && orderData.items) {
      orderData.items.forEach(item => {
        loadMyRating(item.dishId);
      });
    }
  }, [orderData]);

  const loadDishRatings = async (dishId) => {
    try {
      const res = await authApis(cookies.load("token")).get(endpoints["dish-ratings"](dishId));
      setDishRatings(prev => ({ ...prev, [dishId]: res.data }));
    } catch (error) {
      console.error('Lỗi tải đánh giá:', error);
    }
  };

  const loadMyRating = async (dishId) => {
    try {
      const res = await authApis(cookies.load("token")).get(endpoints["my-rating"](dishId));
      if (res.status === 200) {
        setMyRatings(prev => ({ ...prev, [dishId]: res.data }));
      }
    } catch (error) {
      if (error.response && error.response.status === 204) {
        setMyRatings(prev => ({ ...prev, [dishId]: null }));
      } else {
        console.error('Lỗi tải đánh giá của bạn:', error);
      }
    }
  };

  const handleShowRatingModal = async (dish) => {
    setSelectedDish(dish);
    await loadMyRating(dish.dishId);
    const myRating = myRatings[dish.dishId];
    if (myRating) {
      setRating(myRating.point);
      setRatingContent(myRating.content);
    } else {
      setRating(5);
      setRatingContent('');
    }
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedDish(null);
    setRating(5);
    setRatingContent('');
    setErr("");
  };

  const validate = () => {
    if (rating < 1 || rating > 5) {
      setErr('Điểm đánh giá phải từ 1 đến 5!');
      return false;
    }

    if (!ratingContent || ratingContent.trim().isEmpty()) {
      setErr('Vui lòng nhập nội dung đánh giá!');
      return false;
    }

    setErr("");
    return true;
  }

  const handleSubmitRating = async () => {
    if (!selectedDish) return;

    if (validate()) {
      setSubmittingRating(true);
      try {
        const token = cookies.load("token");
        const params = new URLSearchParams();
        params.append('point', rating);
        params.append('content', ratingContent.trim());

        const myRating = myRatings[selectedDish.dishId];
        if (myRating) {
          await authApis(token).patch(endpoints["update-rating"](selectedDish.dishId), params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          message.success('Cập nhật đánh giá thành công!');
        } else {
          await authApis(token).post(endpoints["dish-rating"](selectedDish.dishId), params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          message.success('Đánh giá thành công!');
        }

        handleCloseRatingModal();
        loadDishRatings(selectedDish.dishId);
        loadMyRating(selectedDish.dishId);
      } catch (error) {
        console.error('Lỗi đánh giá:', error);
        setErr('Có lỗi xảy ra khi đánh giá!');
      } finally {
        setSubmittingRating(false);
      }
    }
  };

  const renderStars = (point) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < point ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
  return (
    <>
      {loading === true || !orderData || !orderData.order ? (
        <div className="text-center py-5">
          <MySpinner />
        </div>
      ) : (
        <Container className="my-5" style={{ maxWidth: "700px" }}>
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
                        {item.dishName} (Phụ trách:{" "}
                        {item.chef.firstName + " " + item.chef.lastName})
                      </h6>
                      <span className="text-muted small fw-medium">
                        {item.quantity} x{" "}
                        {item.unitPrice.toLocaleString("vi-VN")} ₫
                      </span>
                      <div className="mt-2 d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/chat?chefId=${item.chef.id}`)}
                          className="d-flex align-items-center gap-2"
                        >
                          <i className="fas fa-comments"></i>
                          Chat với đầu bếp
                        </Button>
                        {order.statusPay === "COMPLETED" && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleShowRatingModal(item)}
                            className="d-flex align-items-center gap-2"
                          >
                            <StarIcon className="w-4 h-4" />
                            {myRatings[item.dishId] ? 'Cập nhật đánh giá' : 'Đánh giá'}
                          </Button>
                        )}
                      </div>
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

          {/* MODAL ĐÁNH GIÁ */}
          <Modal show={showRatingModal} onHide={handleCloseRatingModal} centered>
            <Modal.Header closeButton className="border-b border-border">
              <Modal.Title className="text-foreground font-bold">
                Đánh giá món ăn
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-card">
              {err && <Alert variant="danger" className="mb-3">{err}</Alert>}

              {selectedDish && (
                <div className="mb-3">
                  <p className="text-muted mb-2">Món: <strong>{selectedDish.dishName}</strong></p>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="text-foreground font-semibold text-sm">Số sao *</Form.Label>
                <div className="d-flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 border-0 bg-transparent transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
                      <StarIcon className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-foreground font-semibold text-sm">Nội dung đánh giá</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={ratingContent}
                  onChange={(e) => setRatingContent(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về món này..."
                  className="bg-background border-border text-foreground focus:border-primary"
                />
              </Form.Group>

              <div className="d-flex justify-end gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={handleCloseRatingModal}
                  disabled={submittingRating}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitRating}
                  disabled={submittingRating}
                >
                  {submittingRating ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default OrderDetail;
