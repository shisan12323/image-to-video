import { findOrderByOrderNo } from "@/models/order";
import { updateCreditForOrder } from "@/services/credit";

// 手动触发积分发放脚本
async function fixCreditsForPaidOrder() {
  try {
    // 你可以在这里替换为你的实际订单号
    const orderNo = "YOUR_ORDER_NO_HERE"; // 请替换为你的订单号
    
    console.log("开始处理订单:", orderNo);
    
    // 查找订单
    const order = await findOrderByOrderNo(orderNo);
    
    if (!order) {
      console.log("订单不存在:", orderNo);
      return;
    }
    
    console.log("找到订单:", {
      order_no: order.order_no,
      user_uuid: order.user_uuid,
      status: order.status,
      credits: order.credits,
      paid_at: order.paid_at
    });
    
    // 检查订单状态
    if (order.status !== "paid") {
      console.log("订单状态不是 paid，当前状态:", order.status);
      return;
    }
    
    // 检查是否有积分需要发放
    if (order.credits <= 0) {
      console.log("订单没有积分需要发放");
      return;
    }
    
    // 手动触发积分发放
    await updateCreditForOrder(order);
    
    console.log("积分发放成功！发放积分数量:", order.credits);
    
  } catch (error) {
    console.error("处理积分发放时出错:", error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  fixCreditsForPaidOrder();
}

export { fixCreditsForPaidOrder };