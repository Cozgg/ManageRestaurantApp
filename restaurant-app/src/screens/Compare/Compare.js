import {useContext} from "react";
import {MyCompareContext} from "../../utils/contexts/MyCompareContext";
import {Link} from "react-router-dom";
import {ArrowLeft, Scale, Star, Trash2, X} from "lucide-react";

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

  if (!compareList || compareList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <Scale className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Chưa có món ăn nào để so sánh
        </h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Hãy quay lại trang chủ và chọn biểu tượng "So sánh" trên các món ăn mà
          bạn đang phân vân nhé!
        </p>
        <Link to="/">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold transition-colors shadow-sm">
            Khám phá thực đơn
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 no-underline font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Tiếp tục chọn món
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          So sánh món ăn{" "}
          <span className="text-muted-foreground text-lg font-medium">
            ({compareList.length}/3)
          </span>
        </h2>

        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center gap-2 bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-red px-5 py-2 rounded-lg font-bold transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Xóa tất cả
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
          <thead>
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground bg-muted/30 border-b border-r border-border w-40 align-middle">
                Tiêu chí
              </th>
              {compareList.map((dish) => (
                <th
                  key={dish.id}
                  className="px-4 py-5 text-center bg-background border-b border-r last:border-r-0 border-border relative group"
                >
                  <button
                    onClick={() => handleRemove(dish.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-sm"
                    title="Xóa khỏi danh sách"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-24 h-24 object-cover rounded-xl mx-auto mb-3 shadow-sm border border-border/50"
                  />
                  <h3 className="font-bold text-base text-foreground line-clamp-2">
                    {dish.name}
                  </h3>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-sm">
            <tr className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border bg-muted/10">
                Giá
              </td>
              {compareList.map((dish) => (
                <td
                  key={dish.id}
                  className="px-4 py-3 text-center border-r last:border-r-0 border-border"
                >
                  <span className="font-bold text-lg text-primary">
                    {dish.price?.toLocaleString()} ₫
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border bg-muted/10">
                Thời gian chuẩn bị
              </td>
              {compareList.map((dish) => (
                <td
                  key={dish.id}
                  className="px-4 py-3 text-center border-r last:border-r-0 border-border"
                >
                  <span className="inline-block bg-warning/10 text-warning-foreground font-semibold px-2.5 py-1 rounded-full text-xs">
                    {dish.timePrepare} phút
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border bg-muted/10">
                Đầu bếp
              </td>
              {compareList.map((dish) => (
                <td
                  key={dish.id}
                  className="px-4 py-3 text-center font-medium border-r last:border-r-0 border-border text-foreground"
                >
                  👨‍🍳 {dish.user?.lastName} {dish.user?.firstName}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border bg-muted/10 align-top">
                Mô tả
              </td>
              {compareList.map((dish) => (
                <td
                  key={dish.id}
                  className="px-4 py-3 text-center text-muted-foreground border-r last:border-r-0 border-border align-top leading-relaxed"
                >
                  {dish.description}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border bg-muted/10 align-top">
                Nguyên liệu
              </td>
              {compareList.map((dish) => (
                <td
                  key={dish.id}
                  className="px-4 py-3 text-center text-muted-foreground border-r last:border-r-0 border-border align-top leading-relaxed"
                >
                  {dish.material}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border bg-muted/10">
                Đánh giá
              </td>
              {compareList.map((dish) => (
                <td
                  key={dish.id}
                  className="px-4 py-3 text-center border-r last:border-r-0 border-border"
                >
                  <div className="flex items-center justify-center gap-0.5 text-warning mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    (Chưa có đánh giá)
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
