import {Col, Container, Row} from "react-bootstrap";

const Footer = () => {
  return (
    // bg-light tạo nền xám nhạt, border-top tạo đường viền ngăn cách với nội dung
    <footer className="bg-light text-secondary py-5 mt-5 border-top">
      <Container>
        <Row className="gy-4">
          {/* Cột 1: Giới thiệu */}
          <Col md={4}>
            <h5 className="fw-bold text-success mb-3">🍽️ eRestaurant</h5>
            <p className="small">
              Hương vị tuyệt hảo, dịch vụ tận tâm. Nơi mang đến cho bạn những
              trải nghiệm ẩm thực không thể nào quên.
            </p>
          </Col>

          {/* Cột 2: Đường dẫn nhanh */}
          <Col md={4}>
            <h5 className="fw-bold text-dark mb-3">Khám phá</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="/" className="text-decoration-none text-secondary">
                  Trang chủ
                </a>
              </li>
              <li className="mb-2">
                <a href="/menu" className="text-decoration-none text-secondary">
                  Thực đơn
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/reservation"
                  className="text-decoration-none text-secondary"
                >
                  Đặt bàn
                </a>
              </li>
            </ul>
          </Col>

          {/* Cột 3: Thông tin liên hệ */}
          <Col md={4}>
            <h5 className="fw-bold text-dark mb-3">Liên hệ</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">📍 123 Nguyễn Văn Bảo, Gò Vấp, TP.HCM</li>
              <li className="mb-2">📞 0123 456 789</li>
              <li className="mb-2">✉️ support@erestaurant.com</li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Bản quyền */}
        <div className="text-center small">
          &copy; {new Date().getFullYear()} eRestaurant. Tất cả quyền được bảo
          lưu.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
