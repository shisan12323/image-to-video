import { NextRequest, NextResponse } from "next/server";
import { findOrderByOrderNo } from "@/models/order";
import { updateCreditForOrder } from "@/services/credit";
import { respData, respErr } from "@/lib/resp";

export async function POST(req: NextRequest) {
  try {
    const { order_no } = await req.json();
    
    if (!order_no) {
      return respErr("订单号不能为空");
    }
    
    // 查找订单
    const order = await findOrderByOrderNo(order_no);
    
    if (!order) {
      return respErr("订单不存在");
    }
    
    // 检查订单状态
    if (order.status !== "paid") {
      return respErr(`订单状态不是 paid，当前状态: ${order.status}`);
    }
    
    // 检查是否有积分需要发放
    if (order.credits <= 0) {
      return respErr("订单没有积分需要发放");
    }
    
    // 手动触发积分发放
    await updateCreditForOrder(order);
    
    return respData({
      message: "积分发放成功",
      order_no: order.order_no,
      user_uuid: order.user_uuid,
      credits: order.credits,
      paid_at: order.paid_at
    });
    
  } catch (error) {
    console.error("处理积分发放时出错:", error);
    return respErr("处理积分发放时出错: " + (error instanceof Error ? error.message : "未知错误"));
  }
}