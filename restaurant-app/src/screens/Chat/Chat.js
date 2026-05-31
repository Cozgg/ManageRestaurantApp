import React, { useState, useEffect, useRef, useContext } from 'react';
import { database } from '../../firebaseConfig';
import { ref, push, onValue, update, set, off, get } from 'firebase/database';
import { Container, Row, Col, ListGroup, Form, Button, Badge, Card } from 'react-bootstrap';
import { MyUserContext } from '../../utils/contexts/MyUserContext';
import MySpinner from '../../components/MySpinner';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Chat = () => {
    // 1. LẤY USER TỪ CONTEXT
    const { user } = useContext(MyUserContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const targetChefId = searchParams.get('chefId');

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const messagesListenerRef = useRef(null);
    const conversationsListenerRef = useRef(null);
    const hasScrolledToBottom = useRef(false);

    useEffect(() => {
        if (user) {
            setLoading(true);
            loadConversations(user.id);
            loadUnreadCount(user.id);
            setTimeout(() => setLoading(false), 500);
        }

        return () => {
            if (messagesListenerRef.current) off(messagesListenerRef.current);
            if (conversationsListenerRef.current) off(conversationsListenerRef.current);
        };
    }, [user]);

    useEffect(() => {
        if (user && targetChefId) {
            if (conversations.length === 0 && !loading) {
                createConversationWithChef(targetChefId);
                navigate('/chat', { replace: true });
            } else if (conversations.length > 0) {
                const existingConv = conversations.find(conv => {
                    const participants = Array.isArray(conv.participants) ? conv.participants : [];
                    return participants.includes(String(user.id)) && participants.includes(String(targetChefId));
                });

                if (existingConv) {
                    setSelectedConversation(existingConv);
                    loadMessages(existingConv.id);
                } else {
                    createConversationWithChef(targetChefId);
                }
                navigate('/chat', { replace: true });
            }
        }
    }, [conversations, targetChefId, user, navigate, loading]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const loadConversations = (userId) => {
        const conversationsRef = ref(database, 'conversations');

        conversationsListenerRef.current = conversationsRef;

        onValue(conversationsRef, (snapshot) => {
            try {
                const data = snapshot.val();
                if (!data || typeof data !== 'object' || data === null) {
                    setConversations([]);
                    return;
                }

                const convs = [];
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    if (value && typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const conv = { id: key };
                        Object.keys(value).forEach(prop => {
                            try {
                                conv[prop] = value[prop];
                            } catch (e) {
                                // Skip properties that can't be copied
                            }
                        });
                        if (conv.participants && Array.isArray(conv.participants) &&
                            (conv.participants.includes(userId) || conv.participants.includes(userId.toString()))) {
                            convs.push(conv);
                        }
                    }
                });

                setConversations(convs);
            } catch (error) {
                console.error('Error loading conversations:', error);
                setError('Không thể tải cuộc trò chuyện');
                setConversations([]);
            }
        });
    };

    const loadUnreadCount = (userId) => {
        const unreadRef = ref(database, `unread/${userId}`);

        onValue(unreadRef, (snapshot) => {
            const data = snapshot.val();
            setUnreadCount(data || 0);
        });
    };

    const loadMessages = (conversationId) => {
        if (messagesListenerRef.current) {
            off(messagesListenerRef.current);
        }

        const messagesRef = ref(database, `messages/${conversationId}`);
        messagesListenerRef.current = messagesRef;

        onValue(messagesRef, (snapshot) => {
            try {
                const data = snapshot.val();
                if (!data || typeof data !== 'object' || data === null) {
                    setMessages([]);
                    return;
                }

                const msgs = [];
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    if (value && typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const msg = { id: key };
                        Object.keys(value).forEach(prop => {
                            try {
                                msg[prop] = value[prop];
                            } catch (e) {
                            }
                        });
                        msgs.push(msg);
                    }
                });

                msgs.sort((a, b) => a.timestamp - b.timestamp);
                setMessages(msgs);

                if (user) {
                    markAsRead(conversationId, user.id);
                }
            } catch (error) {
                console.error('Error processing messages:', error);
                setError('Không thể tải tin nhắn');
                setMessages([]);
            }
        });
    };

    const markAsRead = (conversationId, userId) => {
        const unreadRef = ref(database, `unread/${userId}`);
        set(unreadRef, 0);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user) return;

        const conversationId = selectedConversation.id;

        try {
            const messagesRef = ref(database, `messages/${conversationId}`);
            const newMessageRef = push(messagesRef);

            await set(newMessageRef, {
                senderId: user.id.toString(),
                senderName: user.firstName + ' ' + user.lastName,
                senderAvatar: user.avatar,
                message: newMessage,
                timestamp: Date.now(),
                isRead: false
            });

            const conversationRef = ref(database, `conversations/${conversationId}`);
            await update(conversationRef, {
                lastMessage: newMessage,
                lastMessageTime: Date.now()
            });

            const otherUserId = selectedConversation.participants && Array.isArray(selectedConversation.participants)
                ? selectedConversation.participants.find(id => String(id) !== String(user.id))
                : null;

            if (otherUserId) {
                const unreadRef = ref(database, `unread/${otherUserId}`);
                const snapshot = await get(unreadRef);
                const currentCount = snapshot.val() || 0;
                await set(unreadRef, currentCount + 1);
            }

            setNewMessage('');
            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Lỗi khi gửi tin nhắn!');
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getOtherUserName = (conversation) => {
        if (!user || !conversation || !conversation.participants) return 'Người dùng';
        const participants = Array.isArray(conversation.participants) ? conversation.participants : [];

        const otherUserId = participants.find(id => String(id) !== String(user.id));

        return conversation.participantNames?.[otherUserId] || 'Người dùng';
    };

    const createConversationWithChef = async (chefId) => {
        try {
            const conversationsRef = ref(database, 'conversations');
            const newConvRef = push(conversationsRef);

            await set(newConvRef, {
                participants: [String(user.id), String(chefId)],
                participantNames: {
                    [String(user.id)]: user.firstName + ' ' + user.lastName,
                    [String(chefId)]: 'Đầu bếp'
                },
                lastMessage: '',
                lastMessageTime: Date.now(),
                createdAt: Date.now()
            });

            setSelectedConversation({
                id: newConvRef.key,
                participants: [String(user.id), String(chefId)],
                participantNames: {
                    [String(user.id)]: user.firstName + ' ' + user.lastName,
                    [String(chefId)]: 'Đầu bếp'
                }
            });
        } catch (error) {
            console.error('Error creating conversation:', error);
            setError('Không thể tạo cuộc trò chuyện');
        }
    };

    if (loading) return <MySpinner />;

    if (error) return <Container className="mt-5"><h3 className="text-center text-danger">Lỗi: {error}</h3></Container>;

    if (!user) return <Container className="mt-5"><h3 className="text-center">Vui lòng đăng nhập để chat!</h3></Container>;

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">Tin nhắn của tôi</h2>
                {unreadCount > 0 && <Badge bg="danger" pill fs={5}>{unreadCount} tin nhắn mới</Badge>}
            </div>

            <Row>
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-light fw-bold">Cuộc trò chuyện</Card.Header>
                        <ListGroup variant="flush" style={{ height: '60vh', overflowY: 'auto' }}>
                            {(!conversations || !Array.isArray(conversations) || conversations.length === 0) ? (
                                <ListGroup.Item className="text-muted text-center py-4">Chưa có trò chuyện nào</ListGroup.Item>
                            ) : (
                                conversations.map((conv) => (
                                    <ListGroup.Item
                                        key={conv.id}
                                        action
                                        active={selectedConversation?.id === conv.id}
                                        onClick={() => {
                                            setSelectedConversation(conv);
                                            loadMessages(conv.id);
                                        }}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div className="fw-bold">{getOtherUserName(conv)}</div>
                                        <small className={selectedConversation?.id === conv.id ? 'text-white' : 'text-muted'}>
                                            {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                                        </small>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="shadow-sm h-100">
                        {selectedConversation ? (
                            <>
                                <Card.Header className="bg-primary text-white fw-bold">
                                    Đang chat với: {getOtherUserName(selectedConversation)}
                                </Card.Header>

                                <Card.Body
                                    ref={messagesContainerRef}
                                    style={{
                                        height: '50vh',
                                        overflowY: 'auto',
                                        backgroundColor: '#f8f9fa',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end'
                                    }}
                                >
                                    {!Array.isArray(messages) || messages.length === 0 ? (
                                        <div className="text-center text-muted mt-5">Hãy gửi lời chào!</div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className={`d-flex mb-3 ${msg.senderId === user.id.toString() ? 'justify-content-end' : 'justify-content-start'}`}>
                                                <div
                                                    className={`p-3 rounded-4 shadow-sm ${msg.senderId === user.id.toString() ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                                    style={{ maxWidth: '75%' }}
                                                >
                                                    <div>{msg.message}</div>
                                                    <div className={`text-end mt-1 ${msg.senderId === user.id.toString() ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                                        {formatTime(msg.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </Card.Body>

                                <Card.Footer className="bg-white">
                                    <Form className="d-flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tin nhắn..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <Button variant="primary" type="submit" disabled={!newMessage.trim()}>
                                            Gửi
                                        </Button>
                                    </Form>
                                </Card.Footer>
                            </>
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                <h5>Chọn một cuộc trò chuyện để bắt đầu</h5>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
