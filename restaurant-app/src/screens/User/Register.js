import { useContext, useState } from "react";
import { MyUserContext } from "../../utils/contexts/MyUserContext";
import { message } from "antd";
import Apis, { endpoints } from "../../configs/Apis";
import { Button, Card, Container, Form } from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const info = [
    {
      title: "Tên đăng nhập",
      field: "username",
      type: "text",
      placeholder: "Nhập tài khoản của bạn",
    },
    {
      title: "Mật khẩu",
      field: "password",
      type: "password",
      placeholder: "Nhập mật khẩu",
    },
    {
      title: "Họ",
      field: "lastName",
      type: "text",
      placeholder: "Nhập họ của bạn",
    },
    {
      title: "Tên",
      field: "firstName",
      type: "text",
      placeholder: "Nhập tên của bạn",
    },
    {
      title: "Số điện thoại",
      field: "phone",
      type: "text",
      placeholder: "Nhập số điện thoại",
    },
  ];

  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(MyUserContext);

  const validate = () => {
    if (!user.username || !user.password || !user.firstName || !user.lastName || !user.phone) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      let res = await Apis.post(endpoints["register"], user);
      if (res.status === 201) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        nav("/login");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-light d-flex align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="shadow-lg border-0 rounded-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success">Đăng Ký</h2>
              <p className="text-muted">
                Tạo tài khoản mới để trải nghiệm eRestaurant!
              </p>
            </div>

            <Form onSubmit={register}>
              {info.map((item) => (
                <Form.Group className="mb-3" key={item.field}>
                  <Form.Label className="fw-semibold text-dark">
                    {item.title}
                  </Form.Label>
                  <Form.Control
                    size="lg"
                    type={item.type}
                    placeholder={item.placeholder}
                    value={user[item.field]}
                    onChange={(e) =>
                      setUser({ ...user, [item.field]: e.target.value })
                    }
                    className="bg-light border-0 shadow-sm"
                    style={{ fontSize: "1rem" }}
                  />
                </Form.Group>
              ))}

              <Button
                variant="success"
                type="submit"
                size="lg"
                className="w-100 rounded-pill fw-bold shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <MySpinner />
                    Đang xử lý...
                  </>
                ) : (
                  "ĐĂNG KÝ"
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="text-muted">Đã có tài khoản? </span>
              <Link to="/login" className="text-success text-decoration-none fw-semibold">
                Đăng nhập ngay
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
