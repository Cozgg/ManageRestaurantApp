import logo from "./logo.svg";
import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container} from "react-bootstrap";
import Home from "./screens/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import {MyOrderProvider} from "./utils/contexts/MyOrderContext";
import Order from "./screens/Order/Order";
const App = () => {
  return (
    <BrowserRouter>
      <MyOrderProvider>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </Container>
        <Footer />
      </MyOrderProvider>
    </BrowserRouter>
  );
};

export default App;
