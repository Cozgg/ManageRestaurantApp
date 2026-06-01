import {useContext, useEffect} from "react";
import {MyOrderSocketContext} from "../../utils/contexts/MyOrderSocketContext";
import {BellRing, CheckCircle2, Inbox} from "lucide-react";

const RealtimeOrders = () => {
  const {orders, setUnreadCount} = useContext(MyOrderSocketContext);

  useEffect(() => {
    setUnreadCount(0);
  }, [setUnreadCount]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-[60vh]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <BellRing className="w-7 h-7 text-primary animate-bounce" />
          Thông báo đơn hàng Realtime
        </h2>
        <p className="text-muted-foreground mt-2">
          Các đơn hàng mới sẽ tự động xuất hiện tại đây
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <Inbox className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h5 className="text-lg font-semibold text-foreground mb-1">
            Chưa có đơn hàng mới
          </h5>
          <p className="text-muted-foreground">
            Hệ thống đang lắng nghe các đơn đặt hàng tiếp theo...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-green-100 p-2 rounded-full shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <h4 className="font-bold text-green-800 text-lg mb-1">
                  Đơn hàng #{order.orderId}
                </h4>
                <p className="text-green-700 font-medium leading-relaxed m-0">
                  {order.message}
                </p>
              </div>

              <div className="ml-auto flex shrink-0 items-center justify-center pt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealtimeOrders;
