import React, { useState, useEffect, useContext } from "react";
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
import { Edit2, Plus, Search, ShieldAlert, Trash2 } from "lucide-react";

const ChefDashboard = () => {
  const { user } = useContext(MyUserContext);
  const [dishes, setDishes] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [q] = useSearchParams();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedDish, setSelectedDish] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    material: '',
    timePrepare: '',
    image: '',
    categoryId: ''
  });
  const [submitting, setSubmitting] = useState(false);

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
    if (mode === 'edit' && dish) {
      setSelectedDish(dish);
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        price: dish.price || '',
        material: dish.material || '',
        timePrepare: dish.timePrepare || '',
        image: dish.image || '',
        categoryId: dish.categoryId || ''
      });
    } else {
      setSelectedDish(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        material: '',
        timePrepare: '',
        image: '',
        categoryId: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDish(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      material: '',
      timePrepare: '',
      image: '',
      categoryId: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = cookies.load("token");

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('material', formData.material);
      formDataToSend.append('timePrepare', formData.timePrepare);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('categoryId', formData.categoryId);

      if (modalMode === 'add') {
        await authApis(token).post(endpoints["chef-dishes"], formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (modalMode === 'edit' && selectedDish) {
        await authApis(token).patch(`${endpoints["chef-dishes"]}/${selectedDish.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      handleCloseModal();
      setPage(1);
      loadDishes();
    } catch (error) {
      console.error('Lỗi khi lưu món ăn:', error);
      alert('Có lỗi xảy ra khi lưu món ăn!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dishId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      return;
    }

    try {
      const token = cookies.load("token");
      await authApis(token).delete(`${endpoints["chef-dishes"]}/${dishId}`);
      setDishes(dishes.filter(d => d.id !== dishId));
    } catch (error) {
      console.error('Lỗi khi xóa món ăn:', error);
      alert('Có lỗi xảy ra khi xóa món ăn!');
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
            onClick={() => handleShowModal('add')}
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
                          onClick={() => handleShowModal('edit', dish)}
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
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="border-b border-border">
          <Modal.Title className="text-foreground font-bold">
            {modalMode === 'add' ? 'Thêm món ăn mới' : 'Chỉnh sửa món ăn'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-foreground font-semibold text-sm">Tên món ăn *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-background border-border text-foreground focus:border-primary"
                    placeholder="Nhập tên món ăn"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-foreground font-semibold text-sm">Giá bán (VNĐ) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="bg-background border-border text-foreground focus:border-primary"
                    placeholder="Nhập giá bán"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-foreground font-semibold text-sm">Thời gian chuẩn bị (phút) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="timePrepare"
                    value={formData.timePrepare}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="bg-background border-border text-foreground focus:border-primary"
                    placeholder="Nhập thời gian nấu"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-foreground font-semibold text-sm">Danh mục</Form.Label>
                  <Form.Control
                    as="select"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="bg-background border-border text-foreground focus:border-primary"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">Món chính</option>
                    <option value="2">Món khai vị</option>
                    <option value="3">Tráng miệng</option>
                    <option value="4">Đồ uống</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="text-foreground font-semibold text-sm">Nguyên liệu</Form.Label>
              <Form.Control
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="bg-background border-border text-foreground focus:border-primary"
                placeholder="Nhập nguyên liệu (ví dụ: Thịt bò, rau củ..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-foreground font-semibold text-sm">Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="bg-background border-border text-foreground focus:border-primary"
                placeholder="Mô tả về món ăn"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-foreground font-semibold text-sm">URL hình ảnh</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="bg-background border-border text-foreground focus:border-primary"
                placeholder="Nhập URL hình ảnh"
              />
            </Form.Group>

            <div className="d-flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="px-4"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="px-4"
              >
                {submitting ? 'Đang lưu...' : (modalMode === 'add' ? 'Thêm món' : 'Lưu thay đổi')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChefDashboard;
