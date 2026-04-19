import logo from "./logo.svg";
import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container} from "react-bootstrap";
import Home from "./screens/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
