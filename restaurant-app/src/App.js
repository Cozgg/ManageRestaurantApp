import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container} from "react-bootstrap";
import Home from "./screens/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import {MyOrderProvider} from "./utils/contexts/MyOrderContext";
import {MyCompareContext} from "./utils/contexts/MyCompareContext";
import {MyOrderSocketContext} from "./utils/contexts/MyOrderSocketContext";
import MyCompareReducer from "./utils/reducers/MyCompareReducer";
import Order from "./screens/Order/Order";
import ThankYou from "./screens/Order/ThankYou";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import {MyUserContext} from "./utils/contexts/MyUserContext";
import MyUserReducer from "./utils/reducers/MyUserReducer";
import {useEffect, useReducer, useState} from "react";
import Profile from "./screens/User/Profile";
import Compare from "./screens/Compare/Compare";
import Reservation from "./screens/Reservation/Reservation";
import OrderDetail from "./screens/Order/OrderDetail";
import Chat from "./screens/Chat/Chat";
import ChefDashboard from "./screens/Chef/ChefDashboard";
import MainLayout from "./layouts/MainLayout";
import ChefLayout from "./layouts/ChefLayout";
import ChefProfile from "./screens/Chef/ChefProfile";
import ChefOrderDetail from "./screens/Chef/ChefOrderDetail";
import RealtimeOrders from "./screens/Chef/RealtimeOrders";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import ChefOrders from "./screens/Chef/ChefOrders";
import cookies from "react-cookies";
import {authApis, endpoints} from "./configs/Apis";
const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [compareList, compareDispatch] = useReducer(MyCompareReducer, []);

  const [orders, setOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const autoLogin = async () => {
      const token = cookies.load("token");
      if (token) {
        try {
          let res = await authApis(token).get(endpoints["profile"]);
          dispatch({
            type: "login",
            payload: res.data,
          });
        } catch (error) {
          console.error("Tự động đăng nhập thất bại:", error);
        }
      }
    };
    autoLogin();
  }, []);

  useEffect(() => {
    if (!user || user.userRole !== "ROLE_CHEF") return;

    const socket = new SockJS("https://api.erestaurant.me/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/chef/orders", (message) => {
          const data = JSON.parse(message.body);
          setOrders((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [user]);
  return (
    <BrowserRouter>
      <MyUserContext.Provider value={{user, dispatch}}>
        <MyCompareContext.Provider value={[compareList, compareDispatch]}>
          <MyOrderSocketContext.Provider
            value={{orders, unreadCount, setUnreadCount}}
          >
            <MyOrderProvider>
              <Container>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/thank-you" element={<ThankYou />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route
                      path="/order-detail/:orderId"
                      element={<OrderDetail />}
                    />
                  </Route>

                  {/* Chat route - layout dựa trên user role */}
                  {user && user.userRole === "ROLE_CHEF" ? (
                    <Route element={<ChefLayout />}>
                      <Route path="/chat" element={<Chat />} />
                    </Route>
                  ) : (
                    <Route element={<MainLayout />}>
                      <Route path="/chat" element={<Chat />} />
                    </Route>
                  )}

                  {/* Chef layout */}
                  <Route element={<ChefLayout />}>
                    <Route path="/chef-profile" element={<ChefProfile />} />
                    <Route path="/chef" element={<ChefDashboard />} />
                    <Route
                      path="/chef-order-detail/:orderId"
                      element={<ChefOrderDetail />}
                    />
                    <Route
                      path="/realtime-orders"
                      element={<RealtimeOrders />}
                    />
                    <Route path="/chef-orders" element={<ChefOrders />} />
                  </Route>
                </Routes>
              </Container>
              <Footer />
            </MyOrderProvider>
          </MyOrderSocketContext.Provider>
        </MyCompareContext.Provider>
      </MyUserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
