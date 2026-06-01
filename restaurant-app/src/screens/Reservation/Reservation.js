import {useContext, useEffect, useState} from "react";
import Apis, {authApis, endpoints} from "../../configs/Apis";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import cookies from "react-cookies";
import {Alert, notification} from "antd";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Info,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";

const Reservation = () => {
  const {user} = useContext(MyUserContext);
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
      let res = await authApis(token).get(
        endpoints["reservations-user"](user.id),
      );
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
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng đăng nhập để đặt bàn!",
      });
      return;
    }

    if (!formData.tableId || !formData.startTime || !formData.endTime) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn bàn và thời gian!",
      });
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
      await authApis(token).post(endpoints["reservations"], reservationData);
      alert("Đặt bàn thành công!");
      setFormData({
        tableId: "",
        startTime: "",
        endTime: "",
        numberPeople: "1",
      });
      loadReservations();
    } catch (error) {
      const errorMsg = error.response?.data || "Đặt bàn thất bại!";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt bàn này?")) return;
    try {
      const token = cookies.load("token");
      await authApis(token).delete(endpoints["reservation-detail"](id));
      alert("Hủy đặt bàn thành công!");
      loadReservations();
    } catch (error) {
      alert("Hủy đặt bàn thất bại!");
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

  if (loading && tables.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <MySpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-primary" />
          Đặt Bàn
        </h1>
        <p className="text-muted-foreground mt-2">
          Lựa chọn vị trí ngồi hoàn hảo cho bữa ăn của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sticky top-24">
            <h4 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">
              Thông tin đặt bàn
            </h4>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Chọn bàn */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Chọn bàn <span className="text-red-500">*</span>
                </label>
                <select
                  name="tableId"
                  value={formData.tableId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                >
                  <option value="">-- Chọn bàn --</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Bàn {t.tableNumber} - {t.location} (Tối đa {t.capacity}{" "}
                      người)
                    </option>
                  ))}
                </select>
              </div>

              {/* Số người */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Số người <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    name="numberPeople"
                    value={formData.numberPeople}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>

              {/* Thời gian bắt đầu */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Thời gian đến <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Thời gian kết thúc */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Thời gian kết thúc dự kiến{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? (
                  <>
                    <MySpinner size="sm" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-5 h-5" /> XÁC NHẬN ĐẶT BÀN
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 h-full">
            <h4 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">
              Lịch sử đặt bàn của bạn
            </h4>

            {!user ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                <Info className="w-12 h-12 mb-3 opacity-20" />
                <p>Vui lòng đăng nhập để xem lịch sử đặt bàn</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <MySpinner />
              </div>
            ) : reservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
                <p>Bạn chưa có lịch sử đặt bàn nào.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((r) => (
                  <div
                    key={r.id}
                    className="bg-background border border-border rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Thanh màu viền bên trái dựa theo status */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        r.status === "PENDING"
                          ? "bg-yellow-400"
                          : r.status === "CONFIRMED"
                            ? "bg-green-500"
                            : r.status === "CANCELLED"
                              ? "bg-red-500"
                              : "bg-blue-500"
                      }`}
                    ></div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      {/* Thông tin bàn */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h6 className="font-bold text-lg text-foreground m-0">
                            Bàn số {r.tableNumber}
                          </h6>
                          {getStatusBadge(r.status)}
                        </div>

                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2 m-0">
                            <MapPin className="w-4 h-4 text-primary" />
                            Vị trí:{" "}
                            <span className="font-medium text-foreground">
                              {r.tableLocation || "Không xác định"}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 m-0">
                            <Users className="w-4 h-4 text-primary" />
                            Khách:{" "}
                            <span className="font-medium text-foreground">
                              {r.numberPeople} / {r.tableCapacity} người
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Thông tin thời gian và action */}
                      <div className="flex flex-col sm:items-end justify-between gap-3">
                        <div className="bg-secondary/30 rounded-lg p-3 text-sm space-y-1.5 border border-border/50">
                          <p className="flex items-center gap-2 m-0">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              Vào:{" "}
                              <strong className="text-foreground">
                                {formatDate(r.startTime)}
                              </strong>
                            </span>
                          </p>
                          <p className="flex items-center gap-2 m-0 text-muted-foreground pl-6">
                            <span>Ra: {formatDate(r.endTime)}</span>
                          </p>
                        </div>

                        {(r.status === "PENDING" ||
                          r.status === "CONFIRMED") && (
                          <button
                            onClick={() => handleCancelReservation(r.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
                          >
                            <Trash2 className="w-4 h-4" /> Hủy đặt bàn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
