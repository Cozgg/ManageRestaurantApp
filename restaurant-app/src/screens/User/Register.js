import React, {useRef, useState} from "react";
import {message} from "antd";
import Apis, {endpoints} from "../../configs/Apis";
import MySpinner from "../../components/MySpinner";
import {Link, useNavigate} from "react-router-dom";
import {Eye, EyeOff, ArrowLeft, Check, X} from "lucide-react";

const Register = () => {
  const nav = useNavigate();

  // Giữ nguyên các field của bạn, thêm confirmPassword để làm UI
  const [user, setUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatar = useRef();

  // Logic kiểm tra mật khẩu an toàn
  const passwordRequirements = {
    length: user.password.length >= 8,
    uppercase: /[A-Z]/.test(user.password),
    lowercase: /[a-z]/.test(user.password),
    number: /[0-9]/.test(user.password),
  };

  const passwordsMatch =
    user.password === user.confirmPassword && user.password !== "";

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser((prev) => ({...prev, [name]: value}));
  };

  const validate = () => {
    if (
      !user.username ||
      !user.password ||
      !user.firstName ||
      !user.lastName ||
      !user.phone ||
      !user.email
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    if (
      !passwordsMatch ||
      !Object.values(passwordRequirements).every(Boolean)
    ) {
      message.error("Vui lòng đáp ứng yêu cầu mật khẩu!");
      return false;
    }
    return true;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      let form = new FormData();
      for (let key in user) {
        if (key !== "confirmPassword") {
          form.append(key, user[key]);
        }
      }

      if (avatar.current && avatar.current.files.length > 0) {
        form.append("avatar", avatar.current.files[0]);
      }

      let res = await Apis.post(endpoints["register"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        nav("/login");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        {" "}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-success hover:text-primary/80 mb-6 no-underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Đăng nhập
        </Link>
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-success">
              Tạo Tài Khoản
            </h1>
            <p className="text-muted-foreground text-success">
              Tạo tài khoản mới để trải nghiệm eRestaurant!
            </p>
          </div>

          <form onSubmit={register} className="space-y-4">
            {/* HỌ VÀ TÊN (Chia 2 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Họ của bạn
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tên của bạn
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  placeholder="A"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* TÀI KHOẢN VÀ SỐ ĐIỆN THOẠI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Ảnh đại diện (Avatar) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="avatar"
                ref={avatar}
                required
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/20 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none cursor-pointer
      file:mr-4 file:py-2 file:px-4 
      file:rounded-full file:border-0 
      file:text-sm file:font-bold 
      file:bg-primary/10 file:text-primary 
      hover:file:bg-primary/20 file:cursor-pointer file:transition-colors"
              />
            </div>

            {/* MẬT KHẨU */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Mật khẩu
              </label>
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-0 p-0"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg text-sm border border-border/50">
                {Object.entries(passwordRequirements).map(([key, met]) => (
                  <div key={key} className="flex items-center gap-2">
                    {met ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span
                      className={
                        met
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {key === "length" && "Ít nhất 8 ký tự"}
                      {key === "uppercase" && "Ít nhất 1 chữ in hoa"}
                      {key === "lowercase" && "Ít nhất 1 chữ thường"}
                      {key === "number" && "Ít nhất 1 chữ số"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* XÁC NHẬN MẬT KHẨU */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-0 p-0"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {user.confirmPassword && (
                <p
                  className={`text-sm mt-2 font-medium ${passwordsMatch ? "text-primary" : "text-red-500"}`}
                >
                  {passwordsMatch
                    ? "✓ Mật khẩu đã khớp"
                    : "✗ Mật khẩu không khớp"}
                </p>
              )}
            </div>

            {/* ĐIỀU KHOẢN */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 border border-border rounded mt-0.5 accent-primary cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Tôi đồng ý với{" "}
                <Link
                  to="#"
                  className="text-success hover:text-primary/80 no-underline"
                >
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link
                  to="#"
                  className="text-success hover:text-primary/80 no-underline"
                >
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            {/* BUTTON SUBMIT */}
            <button
              type="submit"
              disabled={
                loading ||
                !passwordsMatch ||
                !Object.values(passwordRequirements).every(Boolean)
              }
              className="w-full bg-success hover:bg-primary/90 text-primary-foreground py-3 mt-4 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-0"
            >
              {loading ? (
                <>
                  <MySpinner /> Đang xử lý...
                </>
              ) : (
                "ĐĂNG KÝ TÀI KHOẢN"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-success hover:text-primary/80 font-bold no-underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
