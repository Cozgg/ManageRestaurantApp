import {useEffect, useState} from "react";
import Apis, {endpoints} from "../configs/Apis";
import {Button, Container, Nav, Navbar} from "react-bootstrap";

const Header = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      let res = await Apis.get(endpoints["categories"]);
      console.log(res.data);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
      <Container>
        {/* 1. Logo / Tên nhà hàng */}
        <Navbar.Brand
          href="/"
          className="fw-bold fs-3"
          style={{color: "#27ae60"}}
        >
          🍽️ eRestaurant
        </Navbar.Brand>

        {/* Nút hamburger menu khi thu nhỏ màn hình điện thoại */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* 2. Danh sách các loại món ăn (Nằm giữa) */}
          <Nav className="mx-auto fw-semibold">
            <Nav.Link href="/" className="px-3 text-dark">
              Tất cả món
            </Nav.Link>

            {/* Lặp qua mảng categories để in ra các mục menu */}
            {categories.map((c) => (
              <Nav.Link
                key={c.id}
                href={`/?categoryId=${c.id}`}
                className="px-3 text-secondary"
              >
                {c.name}
              </Nav.Link>
            ))}
          </Nav>

          {/* 3. Khu vực Nút bấm: Giỏ hàng & Đăng nhập (Nằm bên phải) */}
          <div className="d-flex gap-2 mt-3 mt-lg-0">
            {/* Bo tròn hoàn toàn bằng rounded-pill của Bootstrap */}
            <Button
              variant="outline-success"
              className="rounded-pill px-4 fw-bold"
            >
              🛒 Giỏ hàng
            </Button>
            <Button
              variant="success"
              className="rounded-pill px-4 fw-bold text-white"
            >
              Đăng nhập
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
