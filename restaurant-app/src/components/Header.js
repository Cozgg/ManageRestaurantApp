import {useContext, useEffect, useState, useRef} from "react";
import Apis, {endpoints} from "../configs/Apis";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {MyOrderContext} from "../utils/contexts/MyOrderContext";
import {MyUserContext} from "../utils/contexts/MyUserContext";
import {MyCompareContext} from "../utils/contexts/MyCompareContext";
import MySpinner from "../components/MySpinner";
import {database} from "../firebaseConfig";
import {ref, onValue, off} from "firebase/database";
import "./Header.css";
import {
  CalendarDays,
  LogOut,
  MessageCircle,
  Scale,
  ShoppingCart,
  Menu,
  X, // Import thêm icon cho Mobile Menu
} from "lucide-react";
import cookies from "react-cookies";

const Header = () => {
  const {dispatch, user} = useContext(MyUserContext);
  const {totalQuantity} = useContext(MyOrderContext);
  const [compareList] = useContext(MyCompareContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 1. Hook quản lý trạng thái mở/đóng menu trên Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const unreadListenerRef = useRef(null);
  const nav = useNavigate();

  const loadCategories = async () => {
    setLoading(true);
    try {
      let res = await Apis.get(endpoints["categories"]);
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = (userId) => {
    if (!userId) return;

    if (unreadListenerRef.current) {
      off(unreadListenerRef.current);
    }

    const unreadRef = ref(database, `unread/${userId}`);
    unreadListenerRef.current = unreadRef;

    onValue(unreadRef, (snapshot) => {
      const data = snapshot.val();
      setUnreadCount(data || 0);
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (user) {
      loadUnreadCount(user.id);
    }

    return () => {
      if (unreadListenerRef.current) {
        off(unreadListenerRef.current);
      }
    };
  }, [user]);

  const logout = () => {
    dispatch({
      type: "logout",
      payload: null,
    });
    cookies.remove("token");
    nav("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold text-success flex items-center gap-2 no-underline hover:no-underline"
          >
            eRestaurant
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({isActive}) =>
                `text-success font-medium transition-colors no-underline hover:no-underline hover:text-primary ${
                  isActive ? "text-primary font-bold" : "text-foreground"
                }`
              }
            >
              Tất cả món
            </NavLink>

            {/* 2. Hiển thị Loading khi đang gọi API danh mục */}
            {loading ? (
              <span className="text-sm text-muted-foreground d-flex align-items-center">
                <MySpinner />
              </span>
            ) : (
              categories.map((c) => (
                <NavLink
                  key={c.id}
                  to={`/?cateId=${c.id}`}
                  className={({isActive}) =>
                    `font-medium transition-colors no-underline hover:no-underline hover:text-success ${
                      isActive ? "text-success font-bold" : "text-foreground"
                    }`
                  }
                >
                  {c.name}
                </NavLink>
              ))
            )}

            <div className="w-px h-5 bg-border mx-2"></div>

            <Link
              to="/reservation"
              className="flex items-center gap-1.5 text-foreground hover:text-primary font-medium transition-colors no-underline hover:no-underline"
            >
              <CalendarDays className="w-4 h-4" />
              Đặt bàn
            </Link>

            <Link
              to="/compare"
              className="flex items-center gap-1.5 text-foreground hover:text-primary font-medium transition-colors relative no-underline hover:no-underline"
            >
              <Scale className="w-4 h-4" />
              So sánh
              {compareList.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {compareList.length}
                </span>
              )}
            </Link>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <button
                onClick={() => nav("/chat")}
                className="relative p-2 hover:bg-secondary rounded-lg transition-colors group border-0 bg-transparent"
              >
                <MessageCircle className="w-6 h-6 text-foreground group-hover:text-success" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => nav("/order")}
              className="relative p-2 hover:bg-success rounded-lg transition-colors group border-0 bg-transparent"
            >
              <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary" />
              {totalQuantity > 0 && (
                <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* USER PROFILE */}
            <div className="hidden md:block relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-secondary rounded-full transition-colors border border-transparent hover:border-border bg-transparent"
                  >
                    <img
                      src={user.avatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-sm pr-2">
                      {user.username}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-success no-underline hover:no-underline"
                      >
                        Tài khoản của tôi
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-secondary border-0 border-t border-border flex items-center gap-2 bg-transparent"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => nav("/login")}
                  className="bg-success hover:bg-success/90 text-primary-foreground px-5 py-2 rounded-full font-medium transition-colors text-sm shadow-sm border-0"
                >
                  Đăng nhập
                </button>
              )}
            </div>

            {/* Bổ sung nút Toggle Menu cho thiết bị Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors border-0 bg-transparent"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 flex flex-col gap-2 border-t border-border pt-4 pb-2">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-secondary no-underline"
            >
              Tất cả món
            </Link>

            {loading ? (
              <span className="py-2 px-2 text-sm text-muted-foreground">
                Đang tải danh mục...
              </span>
            ) : (
              categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/?cateId=${c.id}`}
                  className="text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-secondary no-underline"
                >
                  {c.name}
                </Link>
              ))
            )}

            <div className="h-px w-full bg-border my-1"></div>
            <Link
              to="/reservation"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-secondary no-underline"
            >
              <CalendarDays className="w-4 h-4" /> Đặt bàn
            </Link>
            <Link
              to="/compare"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-secondary no-underline"
            >
              <Scale className="w-4 h-4" /> So sánh món
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="text-primary font-bold py-2 px-2 mt-2 no-underline"
              >
                Đăng nhập
              </Link>
            ) : (
              <button
                onClick={logout}
                className="text-left text-red-600 font-bold py-2 px-2 mt-2 border-0 bg-transparent flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
