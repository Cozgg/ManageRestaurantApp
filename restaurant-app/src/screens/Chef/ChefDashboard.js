import React, {useState, useEffect, useContext} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  Table,
  Button,
  Badge,
  Alert,
  InputGroup,
  Form,
} from "react-bootstrap";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import Apis, {authApis, endpoints} from "../../configs/Apis";
import MySpinner from "../../components/MySpinner";
import {useSearchParams} from "react-router-dom";
import cookies from "react-cookies";

const ChefDashboard = () => {
  const {user} = useContext(MyUserContext);
  const [dishes, setDishes] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [q] = useSearchParams();

  const loadDishes = async () => {
    try {
      setLoading(true);
      const token = cookies.load("token");
      let url = `${endpoints["chef-dishes"]}?page=${page}`;

      const cateId = q.get("cateId");
      if (cateId) {
        url += `&cateId=${cateId}`;
      }

      const kw = keyword.trim();
      if (kw) {
        url += `&kw=${kw}`;
      }

      let res = await authApis(token).get(url);

      if (page === 1) {
        setDishes(res.data);
      } else {
        setDishes([...dishes, ...res.data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      loadDishes();
    }, 500);

    return () => clearTimeout(timer);
  }, [q, page, keyword]);

  useEffect(() => {
    setPage(1);
  }, [q, keyword]);

  const loadMore = async () => {
    setPage(page + 1);
  };

  if (!user || user.userRole !== "ROLE_CHEF") {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <h4>Bạn không có quyền truy cập</h4>
          <p>Trang này chỉ dành cho Đầu bếp.</p>
        </Alert>
      </Container>
    );
  }

  //   if (loading) return <MySpinner />;

  return (
    <Container className="py-4">
      <div
        className="rounded-4 shadow-sm p-3 p-md-4 mb-4"
        style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        }}
      >
        <Row className="align-items-center g-3">
          {/* LEFT */}
          <Col lg={4}>
            <div>
              <h3 className="fw-bold text-dark mb-1">👨‍🍳 Món ăn của tôi</h3>

              <div className="text-muted small">Quản lý thực đơn đầu bếp</div>
            </div>
          </Col>

          {/* SEARCH */}
          <Col lg={5}>
            <InputGroup
              className="shadow-sm rounded-pill overflow-hidden"
              style={{
                backgroundColor: "#fff",
              }}
            >
              <InputGroup.Text className="bg-white border-0">
                <i className="fas fa-search text-success"></i>
              </InputGroup.Text>

              <Form.Control
                className="border-0 shadow-none py-2"
                placeholder="Tìm món ăn..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* BUTTON */}
          <Col lg={3} className="text-lg-end">
            <Button
              variant="success"
              className="rounded-pill px-4 py-2 fw-bold shadow-sm w-100 w-lg-auto"
            >
              <i className="fas fa-plus me-2"></i>
              Thêm món
            </Button>
          </Col>
        </Row>
      </div>

      {/* EMPTY */}
      {dishes.length === 0 && !loading && (
        <Alert
          variant="light"
          className="text-center rounded-4 shadow-sm py-5 border-0"
        >
          <div className="mb-3 fs-1">🍽️</div>

          <h5 className="mb-2 fw-bold text-dark">Không tìm thấy món ăn nào</h5>

          <p className="text-muted mb-0">
            Hãy thử tìm kiếm từ khóa khác hoặc thêm món mới.
          </p>
        </Alert>
      )}

      {/* DISHES */}
      <Row className="g-4">
        {dishes.map((d) => (
          <Col xs={12} sm={6} lg={4} xl={3} key={d.id}>
            <Card
              className="h-100 border-0 rounded-4 overflow-hidden shadow-sm"
              style={{
                transition: "0.25s",
                backgroundColor: "#fff",
              }}
            >
              {/* IMAGE */}
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={d.image}
                  alt={d.name}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                {/* PREPARE TIME */}
                <Badge
                  bg="warning"
                  text="dark"
                  className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm"
                >
                  ⏱ {d.timePrepare} phút
                </Badge>
              </div>

              {/* BODY */}
              <Card.Body className="d-flex flex-column p-4">
                {/* NAME */}
                <Card.Title
                  className="fw-bold fs-4 text-dark mb-2 text-truncate"
                  title={d.name}
                >
                  {d.name}
                </Card.Title>

                {/* DESC */}
                <Card.Text
                  className="text-muted small mb-3"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "40px",
                  }}
                >
                  {d.description}
                </Card.Text>

                {/* MATERIAL */}
                <div
                  className="small text-secondary mb-3"
                  style={{
                    minHeight: "40px",
                  }}
                >
                  <strong>Nguyên liệu:</strong> {d.material}
                </div>

                {/* PRICE */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-4 text-danger">
                    {d.price.toLocaleString()} ₫
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="d-flex gap-2 mt-auto">
                  <Button
                    variant="light"
                    className="flex-grow-1 rounded-pill border-0 shadow-sm fw-semibold"
                    style={{
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                    }}
                  >
                    <i className="fas fa-pen me-2"></i>
                    Sửa
                  </Button>

                  <Button
                    variant="light"
                    className="flex-grow-1 rounded-pill border-0 shadow-sm fw-semibold"
                    style={{
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                    }}
                  >
                    <i className="fas fa-trash-alt me-2"></i>
                    Xóa
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* LOAD MORE */}
      {dishes.length > 0 && (
        <div className="text-center mt-5">
          {loading ? (
            <MySpinner />
          ) : (
            <Button
              variant="outline-success"
              className="rounded-pill px-5 py-2 fw-bold shadow-sm"
              onClick={loadMore}
            >
              Xem thêm
            </Button>
          )}
        </div>
      )}
    </Container>
  );
};

export default ChefDashboard;
