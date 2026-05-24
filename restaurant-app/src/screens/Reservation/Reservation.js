import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import { MyUserContext } from "../../utils/contexts/MyUserContext";
import { message } from "antd";
import cookies from "react-cookies";

const Reservation = () => {
  const { user } = useContext(MyUserContext);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tableId: "",
    startTime: "",
    endTime: "",
    numberPeople: "1",
  });

  const loadTables = async () => {
    setLoading(true);
    try {
      let res = await Apis.get(endpoints["tables"]);
      setTables(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = cookies.load("token");
      let res = await authApis(token).get(endpoints["reservations-user"](user.id));
      setReservations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
    if (user) {
      loadReservations();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      message.error("Vui lòng đăng nhập để đặt bàn!");
      return;
    }

    if (!formData.tableId || !formData.startTime || !formData.endTime) {
      message.error("Vui lòng chọn bàn và thời gian!");
      return;
    }

    setSubmitting(true);
    try {
      const token = cookies.load("token");
      const reservationData = {
        tableId: formData.tableId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        numberPeople: formData.numberPeople,
        userId: user.id,
      };
      let res = await authApis(token).post(endpoints["reservations"], reservationData);
      message.success("Đặt bàn thành công!");
      setFormData({
        tableId: "",
        startTime: "",
        endTime: "",
        numberPeople: "1",
      });
      loadReservations();
    } catch (error) {
      message.error("Đặt bàn thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt bàn này?")) return;
    try {
      const token = cookies.load("token");
      await authApis(token).delete(endpoints["reservation-detail"](id));
      message.success("Hủy đặt bàn thành công!");
      loadReservations();
    } catch (error) {
      message.error("Hủy đặt bàn thất bại!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning text-dark">Chờ xác nhận</span>;
      case "CONFIRMED":
        return <span className="badge bg-success">Đã xác nhận</span>;
      case "CANCELLED":
        return <span className="badge bg-danger">Đã hủy</span>;
      case "COMPLETED":
        return <span className="badge bg-info">Hoàn thành</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <MySpinner />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4" style={{ color: "#2c3e50" }}>
        Đặt Bàn
      </h2>

      <Row className="g-4">
        {/* Form đặt bàn */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-4">Thông tin đặt bàn</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Chọn bàn</Form.Label>
                <Form.Select
                  name="tableId"
                  value={formData.tableId}
                  onChange={handleInputChange}
                  required
                  className="bg-light border-0 shadow-sm"
                >
                  <option value="">-- Chọn bàn --</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Bàn {t.tableNumber} - {t.location} (Sức chứa: {t.capacity} người)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Số người</Form.Label>
                <Form.Control
                  type="number"
                  name="numberPeople"
                  value={formData.numberPeople}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="bg-light border-0 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Thời gian bắt đầu</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="bg-light border-0 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Thời gian kết thúc</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="bg-light border-0 shadow-sm"
                />
              </Form.Group>

              <Button
                variant="success"
                type="submit"
                className="w-100 rounded-pill fw-bold shadow-sm"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <MySpinner />
                    Đang xử lý...
                  </>
                ) : (
                  "ĐẶT BÀN"
                )}
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Danh sách đặt bàn */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-4">Lịch sử đặt bàn</h4>
            {!user ? (
              <div className="text-center text-muted py-4">
                Vui lòng đăng nhập để xem lịch sử đặt bàn
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center text-muted py-4">
                Chưa có đặt bàn nào
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reservations.map((r) => (
                  <Card key={r.id} className="border shadow-sm">
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <h6 className="fw-bold">Bàn {r.tableNumber}</h6>
                          <p className="mb-1 text-muted small">
                            Vị trí: {r.tableLocation}
                          </p>
                          <p className="mb-1 text-muted small">
                            Sức chứa: {r.tableCapacity} người
                          </p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1 small">
                            <strong>Bắt đầu:</strong> {formatDate(r.startTime)}
                          </p>
                          <p className="mb-1 small">
                            <strong>Kết thúc:</strong> {formatDate(r.endTime)}
                          </p>
                          <p className="mb-2 small">
                            <strong>Số người:</strong> {r.numberPeople}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            {getStatusBadge(r.status)}
                            {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleCancelReservation(r.id)}
                              >
                                Hủy
                              </Button>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reservation;
