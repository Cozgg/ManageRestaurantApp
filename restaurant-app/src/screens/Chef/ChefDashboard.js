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
import {Edit2, Plus, Search, ShieldAlert, Trash2} from "lucide-react";

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
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-red-700 mb-2">
            Bạn không có quyền truy cập
          </h4>
          <p className="text-red-600/80">
            Trang này chỉ dành cho tài khoản Đầu bếp.
          </p>
        </div>
      </div>
    );
  }

  //   if (loading) return <MySpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* HEADER & TÌM KIẾM */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            👨‍🍳 Món ăn của tôi
          </h1>
          <p className="text-muted-foreground">
            Quản lý thực đơn và tình trạng món ăn
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Thanh tìm kiếm */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm tên món ăn..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Nút thêm món */}
          <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Thêm món
          </button>
        </div>
      </div>

      {/* TRẠNG THÁI TRỐNG (EMPTY STATE) */}
      {dishes.length === 0 && !loading && (
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm mt-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h5 className="text-xl font-bold text-foreground mb-2">
            Không tìm thấy món ăn nào
          </h5>
          <p className="text-muted-foreground">
            Hãy thử tìm kiếm từ khóa khác hoặc thêm món mới vào thực đơn của
            bạn.
          </p>
        </div>
      )}

      {/* BẢNG DANH SÁCH MÓN ĂN */}
      {dishes.length > 0 && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border text-sm">
                  <th className="py-4 px-5 font-semibold text-foreground">
                    Món ăn
                  </th>
                  <th className="py-4 px-5 font-semibold text-foreground hidden md:table-cell">
                    Mô tả
                  </th>
                  <th className="py-4 px-5 font-semibold text-foreground">
                    Giá bán
                  </th>
                  <th className="py-4 px-5 font-semibold text-foreground text-center">
                    Thời gian nấu
                  </th>
                  <th className="py-4 px-5 font-semibold text-foreground text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {dishes.map((dish) => (
                  <tr
                    key={dish.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    {/* Cột 1: Ảnh + Tên + Nguyên liệu */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={dish.image || "https://via.placeholder.com/150"}
                          alt={dish.name}
                          className="w-14 h-14 object-cover rounded-lg border border-border/50 shadow-sm"
                        />
                        <div>
                          <div
                            className="font-bold text-foreground text-base mb-0.5 line-clamp-1"
                            title={dish.name}
                          >
                            {dish.name}
                          </div>
                          <div
                            className="text-xs text-muted-foreground line-clamp-1"
                            title={dish.material}
                          >
                            <span className="font-semibold">NL:</span>{" "}
                            {dish.material}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Mô tả (Ẩn trên mobile) */}
                    <td className="py-3 px-5 hidden md:table-cell">
                      <div
                        className="text-muted-foreground line-clamp-2 max-w-xs"
                        title={dish.description}
                      >
                        {dish.description}
                      </div>
                    </td>

                    {/* Cột 3: Giá */}
                    <td className="py-3 px-5 font-bold text-red-500 whitespace-nowrap text-base">
                      {dish.price.toLocaleString()} ₫
                    </td>

                    {/* Cột 4: Thời gian chuẩn bị */}
                    <td className="py-3 px-5 text-center text-dark">
                      <span className="inline-block px-3 py-1 bg-warning/10 rounded-full text-xs font-bold whitespace-nowrap">
                        ⏱ {dish.timePrepare} phút
                      </span>
                    </td>

                    {/* Cột 5: Thao tác */}
                    <td className="py-3 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors shadow-sm"
                          title="Xóa món"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOAD MORE (PHÂN TRANG) */}
      {dishes.length > 0 && (
        <div className="text-center mt-8">
          {loading && page > 1 ? (
            <div className="flex justify-center">
              <MySpinner />
            </div>
          ) : (
            <button
              onClick={loadMore}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-2.5 font-bold transition-colors shadow-sm"
            >
              Xem thêm món
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;
