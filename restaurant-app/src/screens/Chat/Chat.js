import React, {useState, useEffect, useRef, useContext} from "react";
import {database} from "../../firebaseConfig";
import {ref, push, onValue, update, set, off, get} from "firebase/database";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Badge,
  Card,
} from "react-bootstrap";
import {MyUserContext} from "../../utils/contexts/MyUserContext";
import MySpinner from "../../components/MySpinner";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {authApis, endpoints} from "../../configs/Apis";
import cookies from "react-cookies";
import {ArrowLeft, MessageCircle, Send, UserIcon} from "lucide-react";
const Chat = () => {
  // 1. LẤY USER TỪ CONTEXT
  const {user} = useContext(MyUserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetChefId = searchParams.get("chefId");

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesListenerRef = useRef(null);
  const conversationsListenerRef = useRef(null);
  const hasScrolledToBottom = useRef(false);

  const loadChefProfile = async (chefId) => {
    try {
      const token = cookies.load("token");
      let res = await authApis(token).get(endpoints["profile"](chefId));
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadConversations(user.id);
      loadUnreadCount(user.id);
      setTimeout(() => setLoading(false), 500);
    }

    return () => {
      if (messagesListenerRef.current) off(messagesListenerRef.current);
      if (conversationsListenerRef.current)
        off(conversationsListenerRef.current);
    };
  }, [user]);

  useEffect(() => {
    if (user && targetChefId) {
      if (conversations.length === 0 && !loading) {
        createConversationWithChef(targetChefId);
        navigate("/chat", {replace: true});
      } else if (conversations.length > 0) {
        const existingConv = conversations.find((conv) => {
          const participants = Array.isArray(conv.participants)
            ? conv.participants
            : [];
          return (
            participants.includes(String(user.id)) &&
            participants.includes(String(targetChefId))
          );
        });

        if (existingConv) {
          setSelectedConversation(existingConv);
          loadMessages(existingConv.id);
        } else {
          createConversationWithChef(targetChefId);
        }
        navigate("/chat", {replace: true});
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
        behavior: "smooth",
      });
    }
  };

  const loadConversations = (userId) => {
    const conversationsRef = ref(database, "conversations");

    conversationsListenerRef.current = conversationsRef;

    onValue(conversationsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data || typeof data !== "object" || data === null) {
          setConversations([]);
          return;
        }

        const convs = [];
        Object.keys(data).forEach((key) => {
          const value = data[key];
          if (
            value &&
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            const conv = {id: key};
            Object.keys(value).forEach((prop) => {
              try {
                conv[prop] = value[prop];
              } catch (e) {
                // Skip properties that can't be copied
              }
            });
            if (
              conv.participants &&
              Array.isArray(conv.participants) &&
              (conv.participants.includes(userId) ||
                conv.participants.includes(userId.toString()))
            ) {
              convs.push(conv);
            }
          }
        });

        setConversations(convs);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setError("Không thể tải cuộc trò chuyện");
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
        if (!data || typeof data !== "object" || data === null) {
          setMessages([]);
          return;
        }

        const msgs = [];
        Object.keys(data).forEach((key) => {
          const value = data[key];
          if (
            value &&
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            const msg = {id: key};
            Object.keys(value).forEach((prop) => {
              try {
                msg[prop] = value[prop];
              } catch (e) {}
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
        console.error("Error processing messages:", error);
        setError("Không thể tải tin nhắn");
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
        senderName: user.firstName + " " + user.lastName,
        senderAvatar: user.avatar,
        message: newMessage,
        timestamp: Date.now(),
        isRead: false,
      });

      const conversationRef = ref(database, `conversations/${conversationId}`);
      await update(conversationRef, {
        lastMessage: newMessage,
        lastMessageTime: Date.now(),
      });

      const otherUserId =
        selectedConversation.participants &&
        Array.isArray(selectedConversation.participants)
          ? selectedConversation.participants.find(
              (id) => String(id) !== String(user.id),
            )
          : null;

      if (otherUserId) {
        const unreadRef = ref(database, `unread/${otherUserId}`);
        const snapshot = await get(unreadRef);
        const currentCount = snapshot.val() || 0;
        await set(unreadRef, currentCount + 1);
      }

      setNewMessage("");
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Lỗi khi gửi tin nhắn!");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOtherUserName = (conversation) => {
    if (!user || !conversation || !conversation.participants)
      return "Người dùng";
    const participants = Array.isArray(conversation.participants)
      ? conversation.participants
      : [];

    const otherUserId = participants.find(
      (id) => String(id) !== String(user.id),
    );

    return conversation.participantNames?.[otherUserId] || "Người dùng";
  };

  const createConversationWithChef = async (chefId) => {
    try {
      const chefProfile = await loadChefProfile(chefId);
      console.log(chefProfile);
      let chefName = "Đầu bếp";

      // Nếu lấy được data, ghép họ tên lại
      if (chefProfile && chefProfile.firstName) {
        chefName =
          `${chefProfile.lastName || ""} ${chefProfile.firstName}`.trim();
      }
      const conversationsRef = ref(database, "conversations");
      const newConvRef = push(conversationsRef);

      const participantsData = {
        participants: [String(user.id), String(chefId)],
        participantNames: {
          [String(user.id)]: user.firstName + " " + user.lastName,
          [String(chefId)]: chefName,
        },
        lastMessage: "",
        lastMessageTime: Date.now(),
        createdAt: Date.now(),
      };

      await set(newConvRef, participantsData);
      setSelectedConversation({id: newConvRef.key, ...participantsData});
    } catch (error) {
      console.error("Error creating conversation:", error);
      setError("Không thể tạo cuộc trò chuyện");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <MySpinner />
      </div>
    );
  if (error)
    return (
      <div className="mt-10 text-center text-red-500 font-bold text-xl">
        Lỗi: {error}
      </div>
    );
  if (!user)
    return (
      <div className="mt-10 text-center font-bold text-xl">
        Vui lòng đăng nhập để chat!
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      {/* Header Trang */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-2 font-medium no-underline"
          >
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Tin nhắn của tôi
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                {unreadCount} tin mới
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Main Chat Layout (2 Cột) */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* ==================== CỘT TRÁI: DANH SÁCH CUỘC TRÒ CHUYỆN ==================== */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[40vh] md:h-full overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-bold text-foreground">Gần đây</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!conversations || conversations.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">
                Chưa có trò chuyện nào
              </div>
            ) : (
              <div className="flex flex-col">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      loadMessages(conv.id);
                    }}
                    className={`w-full text-left p-4 border-b border-border transition-colors hover:bg-secondary/50 flex justify-between items-center ${
                      selectedConversation?.id === conv.id
                        ? "bg-primary/5 border-l-4 border-l-primary"
                        : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <div>
                      <div
                        className={`font-bold ${selectedConversation?.id === conv.id ? "text-primary" : "text-foreground"}`}
                      >
                        {getOtherUserName(conv)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
                        {conv.lastMessage || "Chưa có tin nhắn"}
                      </div>
                    </div>
                    {conv.lastMessageTime && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================== CỘT PHẢI: KHU VỰC NHẮN TIN ==================== */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[50vh] md:h-full">
          {selectedConversation ? (
            <>
              {/* Header Chat */}
              <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/10">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-lg leading-tight">
                    {getOtherUserName(selectedConversation)}
                  </h2>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                    Đang hoạt động
                  </p>
                </div>
              </div>

              {/* Khu vực hiển thị tin nhắn */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10"
                ref={messagesContainerRef}
              >
                {!messages || messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
                    <p>Hãy gửi lời chào để bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === user.id.toString();
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 rounded-2xl ${
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-background border border-border text-foreground rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p className="m-0 break-words text-sm">
                            {msg.message}
                          </p>
                          <p
                            className={`text-[10px] mt-1 m-0 ${
                              isMine
                                ? "text-primary-foreground/70 text-right"
                                : "text-muted-foreground text-left"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Khung nhập tin nhắn */}
              <div className="p-4 border-t border-border bg-background rounded-b-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn của bạn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-border rounded-full bg-secondary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-secondary/5">
              <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
              <h4 className="font-semibold text-lg text-foreground">
                Hộp thư của bạn
              </h4>
              <p>Chọn một cuộc trò chuyện từ danh sách để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
