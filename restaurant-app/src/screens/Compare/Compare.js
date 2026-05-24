import { useContext } from "react";
import { MyCompareContext } from "../../utils/contexts/MyCompareContext";
import { Button, Card, Col, Container, Image, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const Compare = () => {
  const [compareList, compareDispatch] = useContext(MyCompareContext);

  const handleRemove = (dishId) => {
    compareDispatch({
      type: "REMOVE_FROM_COMPARE",
      payload: dishId,
    });
  };

  const handleClear = () => {
    compareDispatch({
      type: "CLEAR_COMPARE",
    });
  };

  if (compareList.length === 0) {
    return (
      <Container className="my-5 text-center">
        <div className="py-5">
          <h2 className="mb-4 text-muted">Chưa có món nào để so sánh</h2>
          <p className="mb-4">
            Hãy thêm món ăn vào danh sách so sánh từ trang chủ!
          </p>
          <Link to="/">
            <Button variant="success" className="rounded-pill px-5">
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">So sánh món ăn ({compareList.length}/3)</h2>
        <Button variant="outline-danger" onClick={handleClear}>
          Xóa tất cả
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "20%" }}>Tiêu chí</th>
                {compareList.map((dish) => (
                  <th key={dish.id} className="text-center" style={{ width: "26.6%" }}>
                    <Button
                      variant="link"
                      className="text-danger p-0 mb-2"
                      onClick={() => handleRemove(dish.id)}
                    >
                      X
                    </Button>
                    <div>
                      <Image
                        src={dish.image}
                        rounded
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="fw-bold mt-2">{dish.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold">Giá</td>
                {compareList.map((dish) => (
                  <td key={dish.id} className="text-center">
                    <span className="fw-bold text-danger fs-5">
                      {dish.price.toLocaleString()} ₫
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold">Thời gian chuẩn bị</td>
                {compareList.map((dish) => (
                  <td key={dish.id} className="text-center">
                    {dish.timePrepare} phút
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold">Đầu bếp</td>
                {compareList.map((dish) => (
                  <td key={dish.id} className="text-center">
                    {dish.user?.lastName} {dish.user?.firstName}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold">Mô tả</td>
                {compareList.map((dish) => (
                  <td key={dish.id} className="text-center small">
                    {dish.description}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold">Nguyên liệu</td>
                {compareList.map((dish) => (
                  <td key={dish.id} className="text-center small">
                    {dish.material}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold">Đánh giá</td>
                {compareList.map((dish) => (
                  <td key={dish.id} className="text-center">
                    <span className="text-warning">*****</span>
                    <div className="small text-muted">(Chưa có đánh giá)</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Compare;
