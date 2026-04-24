import {useContext, useEffect, useState} from "react";
import Apis, {endpoints} from "../../configs/Apis";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import {useSearchParams} from "react-router-dom";
import {MyOrderContext} from "../../utils/contexts/MyOrderContext";

const Home = () => {
  const {dispatch} = useContext(MyOrderContext);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [q] = useSearchParams();
  const [keyword, setKeyword] = useState("");

  const loadDishes = async () => {
    try {
      setLoading(true);
      let url = `${endpoints["dishes"]}?page=${page}`;

      const cateId = q.get("cateId");
      if (cateId) {
        url += `&cateId=${cateId}`;
      }

      const kw = keyword.trim();
      if (kw) {
        url += `&kw=${kw}`;
      }

      let res = await Apis.get(url);

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

  const handleAddToCart = (dish) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
      },
    });
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

  return (
    <>
      <Container className="my-5">
        <Row className="justify-content-center mb-5">
          <Col xs={12} md={8} lg={6}>
            <InputGroup className="shadow-sm overflow-hidden">
              <Form.Control
                className="border-success border-start-0 shadow-none py-2"
                placeholder="Bạn muốn thưởng thức món gì hôm nay?..."
                aria-label="Tìm kiếm món ăn"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {dishes.length === 0 && !loading && (
          <Alert
            variant="warning"
            className="text-center rounded-4 shadow-sm py-4 border-0"
          >
            <h5 className="mb-0 text-muted">
              🍽️ Rất tiếc, không tìm thấy món ăn nào phù hợp!
            </h5>
          </Alert>
        )}

        <Row className="g-4">
          {dishes.map((d) => (
            <Col xs={12} sm={6} md={4} lg={3} key={d.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={d.image}
                    alt={d.name}
                    style={{height: "200px", objectFit: "cover"}}
                  />

                  <Badge
                    bg="warning"
                    text="dark"
                    className="position-absolute top-0 end-0 m-2 px-2 py-1 shadow-sm"
                  >
                    ⏱ {d.timePrepare} phút
                  </Badge>
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    className="fw-bold fs-5 text-truncate"
                    title={d.name}
                  >
                    {d.name}
                  </Card.Title>

                  <Card.Text
                    className="text-muted small mb-2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {d.description}
                  </Card.Text>

                  <Card.Text
                    className="small mb-3 text-secondary text-truncate"
                    title={d.material}
                  >
                    <strong>Nguyên liệu:</strong> {d.material}
                  </Card.Text>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold fs-5 text-danger">
                        {d.price.toLocaleString()} ₫
                      </span>
                      <span
                        className="text-muted small"
                        style={{fontSize: "0.8rem"}}
                      >
                        👨‍🍳 {d.user.lastName} {d.user.firstName}
                      </span>
                    </div>
                    <Button
                      variant="success"
                      className="w-100 rounded-pill fw-bold shadow-sm"
                      onClick={() => handleAddToCart(d)}
                    >
                      🛒 Thêm vào giỏ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
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
                👇 Xem thêm món ngon
              </Button>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default Home;
