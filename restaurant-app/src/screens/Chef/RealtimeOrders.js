import {Client} from "@stomp/stompjs";
import {useContext, useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {MyOrderSocketContext} from "../../utils/contexts/MyOrderSocketContext";

const RealtimeOrders = () => {
  const {orders, setUnreadCount} = useContext(MyOrderSocketContext);

  useEffect(() => {
    setUnreadCount(0);
  }, [setUnreadCount]);

  return (
    <div className="container mt-4">
      <h3>🔔 Đơn hàng Realtime</h3>
      {orders.length === 0 ? <p>Chưa có đơn mới...</p> : null}

      {orders.map((order, index) => (
        <div key={index} className="alert alert-success shadow-sm">
          <strong>Đơn #{order.orderId}</strong>: {order.message}
        </div>
      ))}
    </div>
  );
};

export default RealtimeOrders;
