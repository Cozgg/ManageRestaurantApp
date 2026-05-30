import {useContext, useEffect, useState} from "react";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import {useNavigate} from "react-router-dom";
import cookies from "react-cookies";
import {authApis, endpoints} from "../../configs/Apis";
import {Button, Card, Col, Container, Image, Row, Table} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import {LogOut, Phone, ShieldCheck} from "lucide-react";

const ChefProfile = () => {
  const {user, dispatch} = useContext(MyUserContext);
  const nav = useNavigate();

  const logout = () => {
    dispatch({
      type: "logout",
      payload: null,
    });
    cookies.remove("token");
    nav("/");
  };

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <MySpinner />
      </Container>
    );
  }
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 text-center">
        {/* Tiêu đề */}
        <h4 className="text-xl font-bold text-primary mb-6">
          Thông tin cá nhân
        </h4>

        {/* Avatar */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <img
            src={user?.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-primary/20 shadow-sm"
          />
          {/* Dấu tích xanh nhỏ góc avatar (Tùy chọn cho sinh động) */}
          <div className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-full border-2 border-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Tên & Username */}
        <h5 className="text-2xl font-bold text-foreground mb-1">
          {user?.firstName} {user?.lastName}
        </h5>
        <p className="text-muted-foreground font-medium mb-6">
          @{user?.username}
        </p>

        {/* Khối thông tin chi tiết */}
        <div className="bg-secondary/30 rounded-xl p-4 space-y-4 text-left mb-8">
          {/* Vai trò */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Vai trò</p>
              <p className="text-sm font-bold text-foreground">Đầu bếp</p>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Điện thoại</p>
              <p className="text-sm font-bold text-foreground">
                {user?.phone || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2.5 rounded-xl font-bold transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ChefProfile;
