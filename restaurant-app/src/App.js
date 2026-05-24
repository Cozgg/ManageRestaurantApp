import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import Home from "./screens/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { MyOrderProvider } from "./utils/contexts/MyOrderContext";
import { MyCompareContext } from "./utils/contexts/MyCompareContext";
import MyCompareReducer from "./utils/reducers/MyCompareReducer";
import Order from "./screens/Order/Order";
import ThankYou from "./screens/Order/ThankYou";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import { MyUserContext } from "./utils/contexts/MyUserContext";
import MyUserReducer from "./utils/reducers/MyUserReducer";
import { useReducer } from "react";
import Profile from "./screens/User/Profile";
import Compare from "./screens/Compare/Compare";
import Reservation from "./screens/Reservation/Reservation";

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [compareList, compareDispatch] = useReducer(MyCompareReducer, []);
  return (
    <BrowserRouter>
      <MyUserContext.Provider value={{ user, dispatch }}>
        <MyCompareContext.Provider value={[compareList, compareDispatch]}>
          <MyOrderProvider>
            <Header />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/order" element={<Order />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/reservation" element={<Reservation />} />
              </Routes>
            </Container>
            <Footer />
          </MyOrderProvider>
        </MyCompareContext.Provider>
      </MyUserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
