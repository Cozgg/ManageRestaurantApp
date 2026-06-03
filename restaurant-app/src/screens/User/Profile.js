import React, { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../utils/contexts/MyUserContext";
import cookies from "react-cookies";
import { useNavigate, Link } from "react-router-dom";
import MySpinner from "../../components/MySpinner";
import { authApis, endpoints } from "../../configs/Apis";
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  User as UserIcon,
  Eye,
} from "lucide-react";

const Profile = () => {
  const { user } = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  const nav = useNavigate();

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = cookies.load("token");
      let url = `${endpoints["get-orders"]}?page=${page}`;
      let res = await authApis(token).get(url);
      if (page === 1) {
        setOrders(res.data);
      } else {
        setOrders([...orders, ...res.data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      if (user) {
        loadOrders();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, page]);

  useEffect(() => {
    setPage(1);
  }, [user]);

  const loadMore = async () => {
    setPage(page + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MySpinner />
      </div>
    );
  }

  const getRoleText = (role) => {
    if (role === "ROLE_CHEF") return "Đầu bếp";
    if (role === "ROLE_USER") return "Khách hàng";
    return "Quản trị viên";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 no-underline font-medium"
      >
        <ArrowLeft className="w-5 h-5" /> Về trang chủ
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 text-center h-full">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full border-4 border-primary/20 shadow-sm"
              />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground mb-6 font-medium">
              @{user.username}
            </p>

            <hr className="my-6 border-border" />

            {/* Chi tiết tài khoản */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Vai trò
                  </p>
                  <p className="text-sm font-bold text-foreground mb-0">
                    {getRoleText(user.userRole)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Điện thoại
                  </p>
                  <p className="text-sm font-bold text-foreground mb-0">
                    {user.phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Tổng số đơn đã giao dịch
                  </p>
                  <p className="text-sm font-bold text-foreground mb-0">
                    {orders.length} đơn hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: LỊCH SỬ GIAO DỊCH ================= */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              Lịch sử giao dịch
            </h3>

            {loading && page === 1 ? (
              <div className="text-center py-12">
                <MySpinner />
                <p className="text-muted-foreground mt-4">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto overflow-y-auto max-h-[400px] rounded-lg border border-border/50 w-full">
                  <table className="w-full text-sm text-left relative">
                    <thead className="sticky top-0 z-10 shadow-sm">
                      <tr className="border-b border-border bg-muted">
                        <th className="py-3 px-4 font-semibold text-foreground bg-muted">
                          Mã Đơn
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground bg-muted">
                          Ngày đặt
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground bg-muted">
                          Thanh toán
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground bg-muted">
                          Trạng thái
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground text-right bg-muted">
                          Tổng tiền
                        </th>
                        <th className="py-3 px-4 font-semibold text-foreground text-center bg-muted">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-8 text-muted-foreground bg-secondary/10"
                          >
                            {user.userRole === "ROLE_CHEF"
                              ? "Bạn chưa có đơn hàng nào."
                              : "Bạn chưa có giao dịch nào."}
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-border hover:bg-secondary/30 transition-colors"
                          >
                            <td className="py-4 px-4 font-bold text-foreground">
                              #{order.id}
                            </td>

                            <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                              {new Date(order.createdDate).toLocaleString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </td>

                            <td className="py-4 px-4 font-medium text-foreground">
                              {order.payment}
                            </td>

                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${order.statusPay === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : order.statusPay === "PENDING"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                              >
                                {order.statusPay}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right font-bold text-red-500 whitespace-nowrap">
                              {order.totalPrice.toLocaleString("vi-VN")} ₫
                            </td>

                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => nav(`/order-detail/${order.id}`)}
                                className="inline-flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-colors text-xs border-0"
                              >
                                <Eye className="w-3.5 h-3.5" /> Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {orders.length > 0 && (
                  <div className="text-center mt-6">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-2 font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                    >
                      {loading && page > 1 ? (
                        <>
                          <MySpinner size="sm" /> Đang tải...
                        </>
                      ) : (
                        "Xem thêm đơn hàng"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
