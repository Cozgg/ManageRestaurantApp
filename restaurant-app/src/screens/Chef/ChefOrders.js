import {useContext, useEffect, useState} from "react";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import cookies from "react-cookies";
import {authApis, endpoints} from "../../configs/Apis";
import {ArrowRight, ChefHat, Clock, ShieldAlert, UserIcon} from "lucide-react";
import MySpinner from "../../components/MySpinner";
import {useNavigate} from "react-router-dom";
const ChefOrders = () => {
  const {user} = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
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

  if (!user || user.userRole !== "ROLE_CHEF") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-red-700 mb-2">
            Bạn không có quyền truy cập
          </h4>
          <p className="text-red-600/80">Trang này chỉ dành cho bộ phận Bếp.</p>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm format ngày rút gọn (VD: 25/05)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit"});
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <ChefHat className="w-8 h-8 text-primary" />
            Tiếp nhận Đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Danh sách các đơn hàng cần chuẩn bị
          </p>
        </div>
      </div>

      {/* DANH SÁCH ORDER THEO DẠNG TICKET (GRID) */}
      {orders.length === 0 && !loading && page === 1 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4 text-muted-foreground">📝</div>
          <h5 className="text-xl font-bold text-foreground mb-2">
            Chưa có đơn hàng nào
          </h5>
          <p className="text-muted-foreground">
            Hiện tại bếp đang rảnh rỗi. Các đơn hàng mới sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card border-2 border-border hover:border-primary/50 rounded-xl p-5 shadow-sm flex flex-col transition-colors relative overflow-hidden group"
            >
              {/* Dải màu đánh dấu trạng thái (Chỉ là điểm nhấn UI) */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

              {/* Thông tin chính: Mã đơn & Thời gian */}
              <div className="flex justify-between items-start mb-4 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                    Mã đơn
                  </p>
                  <h2 className="text-2xl font-black text-foreground">
                    #{order.id}
                  </h2>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2.5 py-1 rounded-md mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-lg leading-none">
                      {formatTime(order.createdDate)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDate(order.createdDate)}
                  </span>
                </div>
              </div>

              {/* Thông tin Khách hàng */}
              <div className="flex items-center gap-2 mb-6 bg-secondary/40 p-2.5 rounded-lg">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground truncate">
                  {order.user?.lastName} {order.user?.firstName}
                </span>
              </div>

              {/* Nút thao tác nằm ở dưới cùng */}
              <button
                onClick={() => nav(`/chef-order-detail/${order.id}`)}
                className="mt-auto w-full flex items-center justify-between bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-3 rounded-lg font-bold transition-colors"
              >
                <span>Chi tiết món nấu</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* NÚT LOAD MORE */}
      {orders.length > 0 && (
        <div className="text-center mt-10">
          {loading && page > 1 ? (
            <div className="flex justify-center">
              <MySpinner />
            </div>
          ) : (
            <button
              onClick={loadMore}
              disabled={loading}
              className="border-2 border-border text-foreground hover:border-primary hover:text-primary rounded-full px-8 py-2.5 font-bold transition-all shadow-sm bg-card hover:bg-primary/5 disabled:opacity-50"
            >
              Tải thêm đơn cũ
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefOrders;
