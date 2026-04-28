import {useContext, useState} from "react";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import {message} from "antd";
import Apis, {authApis, endpoints} from "../../configs/Apis";
import {Button, Card, Container, Form} from "react-bootstrap";
import MySpinner from "../../components/MySpinner";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import cookies from "react-cookies";
const Login = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
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
  ];

  const [loading, setLoading] = useState(false);
  const {dispatch} = useContext(MyUserContext);

  const [params] = useSearchParams();
  const validate = () => {
    if (!user.username || !user.password) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    return true;
  };
  const login = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      let res = await Apis.post(endpoints["login"], user);
      const token = res.data.token;
      cookies.save("token", res.data.token);
      if (res.status === 200) {
        message.success("Đăng nhập thanh cong");
        let profileRes = await authApis(token).get(endpoints["profile"]);
        const userProfile = profileRes.data;
        dispatch({
          type: "login",
          payload: userProfile,
        });
        const next = params.get("next") || "/";
        nav(next);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-light d-flex align-items-center"
      style={{minHeight: "100vh"}}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="shadow-lg border-0 rounded-4"
          style={{maxWidth: "450px", width: "100%"}}
        >
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success">Đăng Nhập</h2>
              <p className="text-muted">
                Chào mừng bạn quay trở lại eRestaurant!
              </p>
            </div>

            <Form onSubmit={login}>
              {info.map((item) => (
                <Form.Group className="mb-4" key={item.field}>
                  <Form.Label className="fw-semibold text-dark">
                    {item.title}
                  </Form.Label>
                  <Form.Control
                    size="lg"
                    type={item.type}
                    placeholder={item.placeholder}
                    value={user[item.field]}
                    onChange={(e) =>
                      setUser({...user, [item.field]: e.target.value})
                    } // ĐÃ SỬA LỖI LẤY TEXT
                    className="bg-light border-0 shadow-sm"
                    style={{fontSize: "1rem"}}
                  />
                </Form.Group>
              ))}

              <div className="d-flex justify-content-between align-items-center mb-4 small">
                <Form.Check
                  type="checkbox"
                  label="Ghi nhớ đăng nhập"
                  className="text-muted"
                />
                <a
                  href="#forgot"
                  className="text-success text-decoration-none fw-semibold"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                variant="success"
                type="submit"
                size="lg"
                className="w-100 rounded-pill fw-bold shadow-sm"
                disabled={loading} // Khóa nút khi đang load
              >
                {loading ? (
                  <>
                    <MySpinner />
                    Đang xử lý...
                  </>
                ) : (
                  "ĐĂNG NHẬP"
                )}
              </Button>
            </Form>

            <Link to={"/register"}>Chưa có tài khoản? Đăng ký ngay</Link>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
