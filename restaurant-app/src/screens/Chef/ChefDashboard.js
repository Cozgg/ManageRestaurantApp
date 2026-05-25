import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Button, Badge, Alert } from 'react-bootstrap';
import { MyUserContext } from '../../utils/contexts/MyUserContext';
import Apis, { endpoints } from '../../configs/Apis';
import MySpinner from '../../components/MySpinner';

const ChefDashboard = () => {
    const [user] = useContext(MyUserContext);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState('dishes');

    useEffect(() => {
        if (user && user.userRole === 'ROLE_CHEF') {
            loadMyDishes();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadMyDishes = async () => {
        setLoading(true);
        try {
            const res = await Apis.get(endpoints.dishes);
            const myDishes = res.data.filter(d => d.userId === user.id);
            setDishes(myDishes);
        } catch (error) {
            console.error('Error loading dishes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.userRole !== 'ROLE_CHEF') {
        return (
            <Container className="mt-5">
                <Alert variant="danger" className="text-center">
                    <h4>Bạn không có quyền truy cập</h4>
                    <p>Trang này chỉ dành cho Đầu bếp.</p>
                </Alert>
            </Container>
        );
    }

    if (loading) return <MySpinner />;

    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">Dashboard Đầu bếp</h4>
                        </Card.Header>
                        <Card.Body>
                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="mb-3"
                            >
                                <Tab eventKey="dishes" title="Quản lý món ăn">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Danh sách món ăn của bạn</h5>
                                        <Button variant="success">
                                            + Thêm món mới
                                        </Button>
                                    </div>

                                    {dishes.length === 0 ? (
                                        <Alert variant="info">
                                            Bạn chưa có món ăn nào. Hãy thêm món mới!
                                        </Alert>
                                    ) : (
                                        <Table responsive hover bordered>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Hình ảnh</th>
                                                    <th>Tên món</th>
                                                    <th>Giá</th>
                                                    <th>Thời gian chuẩn bị</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dishes.map((dish) => (
                                                    <tr key={dish.id}>
                                                        <td>
                                                            <img
                                                                src={dish.image || 'https://via.placeholder.com/50'}
                                                                alt={dish.name}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                className="rounded"
                                                            />
                                                        </td>
                                                        <td className="fw-bold">{dish.name}</td>
                                                        <td>{dish.price?.toLocaleString('vi-VN')} VNĐ</td>
                                                        <td>{dish.preparationTime} phút</td>
                                                        <td>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="me-2"
                                                            >
                                                                Sửa
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ChefDashboard;
