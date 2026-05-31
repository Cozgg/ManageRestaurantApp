import { useContext, useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
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
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { MyOrderContext } from "../../utils/contexts/MyOrderContext";
import { MyCompareContext } from "../../utils/contexts/MyCompareContext";
import { Check, Plus, Search } from "lucide-react";

const Home = () => {
  const { dispatch } = useContext(MyOrderContext);
  const [compareList, compareDispatch] = useContext(MyCompareContext);
  const navigate = useNavigate();
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

  const handleAddToCompare = (dish) => {
    compareDispatch({
      type: "ADD_TO_COMPARE",
      payload: dish,
    });
  };

  const isInCompare = (dishId) => {
    return compareList.some((d) => d.id === dishId);
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
      <Container className="max-w-5xl mx-auto">
        {/* Comparison CTA Sticky Bar */}
        {compareList.length > 0 && (
          <div className="sticky top-16 z-40 bg-accent/10 border-b border-accent/20 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <span className="text-foreground font-medium">
                {compareList.length} món ăn đã chọn
              </span>
              <Link to="/compare">
                <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors">
                  So sánh ngay
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Menu Section */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          {/* Search Bar - Tích hợp UI mới cho thanh tìm kiếm cũ */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative flex items-center shadow-sm rounded-full overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary transition-all">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                className="w-full py-3 pl-12 pr-4 bg-background focus:outline-none"
                placeholder="Bạn muốn thưởng thức món gì hôm nay?..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          {/* Thông báo rỗng */}
          {dishes.length === 0 && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-6 text-center shadow-sm">
              <h5 className="text-lg font-medium mb-0">
                Rất tiếc, không tìm thấy món ăn nào phù hợp!
              </h5>
            </div>
          )}

          {/* Grid Danh sách món ăn */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes === null ? (
              <MySpinner />
            ) : (
              dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Image Box */}
                  <div className="w-full h-48 relative bg-muted">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge Thời gian chuẩn bị */}
                    <span className="absolute top-2 left-2 bg-warning text-warning-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {dish.timePrepare} phút
                    </span>

                    {/* Compare Checkbox */}
                    <button
                      onClick={() =>
                        !isInCompare(dish.id) && handleAddToCompare(dish)
                      }
                      disabled={isInCompare(dish.id)}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${isInCompare(dish.id)
                        ? "bg-primary border-primary cursor-not-allowed"
                        : "bg-white border-border hover:border-primary"
                        }`}
                      title={
                        isInCompare(dish.id)
                          ? "Đã chọn so sánh"
                          : "Thêm vào so sánh"
                      }
                    >
                      {isInCompare(dish.id) && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3
                        className="text-lg font-semibold text-foreground line-clamp-1"
                        title={dish.name}
                      >
                        {dish.name}
                      </h3>
                      <p className="text-xl font-bold text-primary mb-3">
                        {dish.price?.toLocaleString()} ₫
                      </p>
                    </div>

                    <p
                      className="text-sm text-muted-foreground mb-2 line-clamp-2"
                      title={dish.description}
                    >
                      {dish.description}
                    </p>

                    <p
                      className="text-sm text-muted-foreground mb-4 truncate"
                      title={dish.material}
                    >
                      <strong className="text-foreground">Nguyên liệu:</strong>{" "}
                      {dish.material}
                    </p>

                    <div className="flex items-center gap-2 mb-4 mt-auto">
                      <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
                        👨‍🍳 {dish.user?.lastName} {dish.user?.firstName}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleAddToCart(dish)}
                        className="flex-1 flex items-center justify-center bg-success hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm vào giỏ
                      </button>
                      <button
                        onClick={() => navigate(`/chat?chefId=${dish.user?.id}`)}
                        className="flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-md font-medium transition-colors"
                        title="Chat với đầu bếp"
                      >
                        💬
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More & Spinner */}
          {dishes.length > 0 && (
            <div className="text-center mt-12">
              {loading ? (
                <MySpinner />
              ) : (
                <Button
                  onClick={loadMore}
                  variant="success"
                  className="rounded-pill px-5"
                >
                  Xem thêm món ngon
                </Button>
              )}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Sẵn sàng để đặt món
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Xem thực đơn đầy đủ và đặt món chỉ với vài cú nhấp chuột.
            </p>
            <Link to="/order">
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4 rounded-md font-bold transition-colors shadow-sm">
                Xem chi tiết
              </button>
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
};

export default Home;
