import { useContext, useState } from "react";
import { MyOrderContext } from "../../utils/contexts/MyOrderContext";
import { MyUserContext } from "../../utils/contexts/MyUserContext";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import {
  CreditCardOutlined,
  QrcodeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./Order.css";
import { Link, useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import { authApis, endpoints } from "../../configs/Apis";
import { message, Popconfirm } from "antd";
import MySpinner from "../../components/MySpinner";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  Trash2,
  Wallet,
} from "lucide-react";

const Order = () => {
  const { cart, dispatch } = useContext(MyOrderContext);
  const { user } = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("CASH");
  const [err, setErr] = useState("");

  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const nav = useNavigate();

  const handleUpdateToCart = (id, quantity) => {
    const qty = parseInt(quantity);
    if (qty > 0) {
      dispatch({
        type: "UPDATE_TO_CART",
        payload: {
          id: id,
          quantity: qty,
        },
      });
    } else {
      Alert("Số lượng phải lớn hơn 0");
    }
  };

  const handleRemoveFromCart = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: {
        id: id,
      },
    });
  };

  const pay = async (paymentMethod) => {
    setLoading(true);
    try {
      const token = cookies.load("token");
      const orderData = {
        paymentMethod: paymentMethod,
        items: cart,
      };
      let res = await authApis(token).post(endpoints["add-order"], orderData);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      message.error("Có lỗi xảy ra khi tạo đơn hàng.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!cart || cart.length === 0) {
      setErr("Giỏ hàng đang trống!");
      return false;
    }

    if (total <= 0) {
      setErr("Tổng tiền đơn hàng phải lớn hơn 0!");
      return false;
    }

    if (!selectedPayment) {
      setErr("Vui lòng chọn phương thức thanh toán!");
      return false;
    }

    setErr("");
    return true;
  }

  const handleCheckout = async (paymentMethod) => {
    if (validate()) {
      const result = await pay(paymentMethod);
      if (!result) return;
      switch (paymentMethod) {
        case "CASH":
          dispatch({
            type: "CLEAR_CART",
          });
          await nav(`/thank-you?orderId=${result}`);
          break;
        case "MOMO":
          if (result.startsWith("http")) {
            window.location.href = result;
          } else {
            message.error("Lỗi lấy link thanh toán MoMo");
          }
          break;
        case "ZALOPAY":
          message.success("Chức năng zalo pay sẽ sớm được ra mắt");
          break;
        default:
          break;
      }
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium no-underline"
        >
          <ArrowLeft className="w-5 h-5" /> Về thực đơn
        </Link>
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-sm">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Giỏ hàng đang trống
          </h1>
          <p className="text-muted-foreground mb-8">
            Có vẻ như bạn chưa chọn món ăn nào. Hãy khám phá thực đơn ngay nhé!
          </p>
          <Link to="/">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold transition-colors shadow-sm">
              Khám phá thực đơn
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      {err && <Alert variant="danger" className="mb-4">{err}</Alert>}

      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-medium no-underline"
      >
        <ArrowLeft className="w-5 h-5" /> Tiếp tục chọn món
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">
        Giỏ hàng của bạn{" "}
        <span className="text-muted-foreground text-lg font-medium">
          ({cart.length} món)
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ================= DANH SÁCH MÓN ĂN ================= */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-center shadow-sm"
            >
              {/* 1. Ảnh món (Kích thước cố định) */}
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                className="w-full sm:w-24 h-24 object-cover rounded-lg border border-border/50 shadow-sm flex-shrink-0"
              />

              {/* 2. Thông tin món ăn (Căn trái và chiếm không gian giữa) */}
              <div className="flex-1 w-full text-center sm:text-left">
                <h3
                  className="font-bold text-lg text-foreground line-clamp-1 mb-1"
                  title={item.name}
                >
                  {item.name}
                </h3>
                <p className="text-primary font-bold m-0">
                  {item.price.toLocaleString()} ₫
                </p>
              </div>

              {/* 3. Khu vực thao tác (Gom lại nằm bên phải trên Desktop) */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0">
                {/* Tăng giảm số lượng */}
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1 border border-border">
                  <button
                    onClick={() =>
                      handleUpdateToCart(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="p-1.5 hover:bg-background rounded-md transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateToCart(item.id, e.target.value)
                    }
                    className="w-8 text-center font-bold bg-transparent border-0 p-0 focus:ring-0 text-foreground focus:outline-none"
                  />
                  <button
                    onClick={() =>
                      handleUpdateToCart(item.id, item.quantity + 1)
                    }
                    className="p-1.5 hover:bg-background rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                {/* Cụm Tổng tiền & Nút xóa */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-right min-w-[90px]">
                    <p className="font-bold text-red-500 text-lg m-0">
                      {(item.price * item.quantity).toLocaleString()} ₫
                    </p>
                  </div>
                  <Popconfirm
                    title="Xóa món ăn"
                    description="Bạn có chắc chắn muốn xóa món này khỏi giỏ hàng?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleRemoveFromCart(item.id)}
                  >
                    <button
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-0"
                      title="Xóa món"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= TỔNG KẾT & THANH TOÁN ================= */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
              Tổng đơn hàng
            </h2>

            {/* Tóm tắt tiền */}
            <div className="space-y-3 pb-4 border-b border-border mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính ({cart.length} món)</span>
                <span className="font-medium text-foreground">
                  {total.toLocaleString()} ₫
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí dịch vụ</span>
                <span className="font-medium text-primary">Miễn phí</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="font-bold text-foreground text-base">
                  Tổng cộng
                </span>
                <span className="font-bold text-2xl text-red-500">
                  {total.toLocaleString()} ₫
                </span>
              </div>
            </div>

            {/* Chọn Phương thức thanh toán */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground mb-3">
                Phương thức thanh toán
              </label>
              <div className="space-y-2">
                {/* Option 1: Tiền mặt */}
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPayment === "CASH" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}`}
                >
                  <input
                    type="radio"
                    value="CASH"
                    checked={selectedPayment === "CASH"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <Wallet className="w-5 h-5 text-foreground" />
                  <span className="font-medium text-sm text-foreground flex-1">
                    Thanh toán tiền mặt
                  </span>
                </label>

                {/* Option 2: MoMo */}
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPayment === "MOMO" ? "border-[#a50064] bg-[#a50064]/5" : "border-border hover:bg-secondary/50"}`}
                >
                  <input
                    type="radio"
                    value="MOMO"
                    checked={selectedPayment === "MOMO"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 accent-[#a50064]"
                  />
                  <CreditCard className="w-5 h-5 text-[#a50064]" />
                  <span className="font-medium text-sm text-foreground flex-1">
                    Ví điện tử MoMo
                  </span>
                </label>

                {/* Option 3: ZaloPay */}
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPayment === "ZALOPAY" ? "border-[#0068ff] bg-[#0068ff]/5" : "border-border hover:bg-secondary/50"}`}
                >
                  <input
                    type="radio"
                    value="ZALOPAY"
                    checked={selectedPayment === "ZALOPAY"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 accent-[#0068ff]"
                  />
                  <QrCode className="w-5 h-5 text-[#0068ff]" />
                  <span className="font-medium text-sm text-foreground flex-1">
                    Ví ZaloPay
                  </span>
                </label>
              </div>
            </div>

            {/* Nút Đặt hàng / Đăng nhập */}
            {!user ? (
              <Link to="/login?next=/order" className="no-underline">
                <button className="w-full bg-foreground hover:bg-foreground/90 text-background py-3.5 rounded-lg font-bold transition-colors">
                  ĐĂNG NHẬP ĐỂ ĐẶT HÀNG
                </button>
              </Link>
            ) : (
              <button
                onClick={() => handleCheckout(selectedPayment)}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <MySpinner /> Đang xử lý...
                  </>
                ) : (
                  "ĐẶT HÀNG NGAY"
                )}
              </button>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Thanh toán an toàn & bảo mật
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
