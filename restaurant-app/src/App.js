import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container} from "react-bootstrap";
import Home from "./screens/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import {MyOrderProvider} from "./utils/contexts/MyOrderContext";
import Order from "./screens/Order/Order";
import ThankYou from "./screens/Order/ThankYou";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import {MyUserContext} from "./utils/contexts/MyUserContext";
import MyUserReducer from "./utils/reducers/MyUserReducer";
import {useReducer} from "react";
import Profile from "./screens/User/Profile";
const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <BrowserRouter>
      <MyUserContext.Provider value={{user, dispatch}}>
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
            </Routes>
          </Container>
          <Footer />
        </MyOrderProvider>
      </MyUserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
