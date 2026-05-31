import React, {useContext, useState} from "react";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import {message} from "antd";
import Apis, {authApis, endpoints} from "../../configs/Apis";
import MySpinner from "../../components/MySpinner";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import cookies from "react-cookies";
import {Eye, EyeOff, ArrowLeft} from "lucide-react";

const Login = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {dispatch} = useContext(MyUserContext);
  const [params] = useSearchParams();

  const validate = () => {
    if (!user.username || !user.password) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  const login = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      let res = await Apis.post(endpoints["login"], user);
      const token = res.data.token;
      cookies.save("token", res.data.token);
      if (res.status === 200) {
        message.success("Đăng nhập thành công");
        let profileRes = await authApis(token).get(endpoints["profile"]);
        const userProfile = profileRes.data;
        dispatch({
          type: "login",
          payload: userProfile,
        });
        if (userProfile.userRole === "ROLE_CHEF") nav("/chef");
        else {
          const next = params.get("next") || "/";
          nav(next);
        }
      }
    } catch (error) {
      console.log(error);
      message.error("Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-8 w-full">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-success hover:text-primary/80 mb-8 no-underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Chào mừng quay lại
            </h1>
            <p className="text-muted-foreground">
              Đăng nhập vào tài khoản eRestaurant
            </p>
          </div>

          <form onSubmit={login} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                placeholder="Nhập tài khoản của bạn"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={(e) => setUser({...user, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border border-border rounded accent-primary cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link
                to="#forgot"
                className="text-sm text-success hover:text-success/80 no-underline font-medium hover:no-underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-success hover:bg-success/90 text-primary-foreground py-2.5 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2 border-0 mt-4"
            >
              {loading ? (
                <>
                  <MySpinner /> Đang xử lý...
                </>
              ) : (
                "ĐĂNG NHẬP"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border"></div>
            <span className="text-sm text-muted-foreground">hoặc</span>
            <div className="flex-1 border-t border-border"></div>
          </div>
          <p className="mt-6 text-center text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-success hover:text-primary/80 font-bold no-underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
