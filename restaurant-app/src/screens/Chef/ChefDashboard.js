import React, { useState, useEffect, useContext, useRef } from "react";
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
  Modal,
} from "react-bootstrap";
import { MyUserContext } from "../../utils/contexts/MyUserContext";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import MySpinner from "../../components/MySpinner";
import { useSearchParams } from "react-router-dom";
import cookies from "react-cookies";
import { Edit2, Plus, Search, ShieldAlert, Trash2, X } from "lucide-react";

const ChefDashboard = () => {
  const { user } = useContext(MyUserContext);
  const [dishes, setDishes] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [q] = useSearchParams();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedDish, setSelectedDish] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    material: "",
    timePrepare: "",
    image: "",
    categoryId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const imageDish = useRef();

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

  const handleShowModal = (mode, dish = null) => {
    setModalMode(mode);
    if (mode === "edit" && dish) {
      setSelectedDish(dish);
      setFormData({
        name: dish.name || "",
        description: dish.description || "",
        price: dish.price || "",
        material: dish.material || "",
        timePrepare: dish.timePrepare || "",
        image: dish.image || "",
        categoryId: dish.categoryId || "",
      });
    } else {
      setSelectedDish(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        material: "",
        timePrepare: "",
        image: "",
        categoryId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDish(null);
    setErr("");
    setFormData({
      name: "",
      description: "",
      price: "",
      material: "",
      timePrepare: "",
      image: "",
      categoryId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name || formData.name.trim().isEmpty()) {
      setErr("Tên món ăn không được để trống!");
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setErr("Giá bán phải lớn hơn 0!");
      return false;
    }

    if (!formData.timePrepare || parseInt(formData.timePrepare) <= 0) {
      setErr("Thời gian nấu phải lớn hơn 0!");
      return false;
    }

    if (!formData.categoryId) {
      setErr("Vui lòng chọn danh mục!");
      return false;
    }

    if (!formData.material || formData.material.trim().isEmpty()) {
      setErr("Nguyên liệu không được để trống!");
      return false;
    }

    if (!formData.description || formData.description.trim().isEmpty()) {
      setErr("Mô tả không được để trống!");
      return false;
    }

    if (modalMode === "add" && (!imageDish.current || imageDish.current.files.length === 0)) {
      setErr("Vui lòng chọn hình ảnh!");
      return false;
    }

    setErr("");
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const token = cookies.load("token");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("material", formData.material.trim());
      formDataToSend.append("timePrepare", formData.timePrepare);
      formDataToSend.append("categoryId", formData.categoryId);
      if (imageDish.current && imageDish.current.files.length > 0) {
        formDataToSend.append("image", imageDish.current.files[0]);
      }

      if (modalMode === "add") {
        await authApis(token).post(endpoints["chef-dishes"], formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (modalMode === "edit" && selectedDish) {
        await authApis(token).patch(
          `${endpoints["chef-dishes"]}/${selectedDish.id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      handleCloseModal();
      setPage(1);
      loadDishes();
    } catch (error) {
      console.error("Lỗi khi lưu món ăn:", error);
      setErr("Có lỗi xảy ra khi lưu món ăn!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dishId) => {
    if (!dishId || dishId <= 0) {
      setErr("ID món ăn không hợp lệ!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      return;
    }

    try {
      const token = cookies.load("token");
      await authApis(token).delete(`${endpoints["chef-dishes"]}/${dishId}`);
      setDishes(dishes.filter((d) => d.id !== dishId));
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
      setErr("Có lỗi xảy ra khi xóa món ăn!");
    }
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
      {err && <Alert variant="danger" className="mb-4">{err}</Alert>}

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
          <button
            onClick={() => handleShowModal("add")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
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
                          onClick={() => handleShowModal("edit", dish)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors shadow-sm"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dish.id)}
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

      {/* MODAL THÊM/SỬA MÓN ĂN */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          {/* Khung Modal */}
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-foreground">
                {modalMode === "add" ? "Thêm món ăn mới" : "Chỉnh sửa món ăn"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal (Nội dung Form cuộn được) */}
            <div className="p-6 overflow-y-auto">
              {err && <Alert variant="danger" className="mb-4">{err}</Alert>}

              <form id="dishForm" onSubmit={handleSubmit} className="space-y-5">
                {/* Hàng 1: Tên món & Giá bán */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Tên món ăn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="VD: Bò Bít Tết"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="VD: 250000"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Hàng 2: Thời gian chuẩn bị & Danh mục */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Thời gian nấu (phút){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="timePrepare"
                      value={formData.timePrepare}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="VD: 15"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      <option value="1">Món chính</option>
                      <option value="2">Món khai vị</option>
                      <option value="3">Tráng miệng</option>
                      <option value="4">Đồ uống</option>
                    </select>
                  </div>
                </div>

                {/* Nguyên liệu */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Nguyên liệu
                  </label>
                  <input
                    type="text"
                    name="material"
                    required
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="VD: Thịt bò, muối, tiêu, bơ..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Mô tả món ăn
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    required
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Nhập mô tả ngắn gọn về món ăn..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                  ></textarea>
                </div>

                {/* URL Hình ảnh */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    URL Hình ảnh
                  </label>
                  <input
                    type="file"
                    name="image"
                    ref={imageDish}
                    required
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
              </form>
            </div>

            {/* Footer Modal (Nút Hủy / Lưu) */}
            <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl font-semibold text-foreground bg-background border border-border hover:bg-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="dishForm" // Thuộc tính HTML5 giúp kích hoạt submit của Form ở trên
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-sm"
              >
                {submitting ? (
                  <>
                    <MySpinner size="sm" className="mr-2" /> Đang xử lý...
                  </>
                ) : modalMode === "add" ? (
                  "Thêm món"
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;
