export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📥 收到 Replicate webhook:", body);

    const {
      id,
      status,
      output,
      error,
      created_at,
      started_at,
      completed_at,
      input,
      metrics,
    } = body;

    // 根据任务状态处理不同的逻辑
    switch (status) {
      case "succeeded":
        console.log("✅ 任务成功完成:", {
          id,
          output,
          completed_at,
        });
        
        // 这里可以添加成功后的处理逻辑
        // 比如：更新数据库、发送通知、保存视频URL等
        
        break;

      case "failed":
        console.error("❌ 任务失败:", {
          id,
          error,
          completed_at,
        });
        
        // 这里可以添加失败后的处理逻辑
        // 比如：重试机制、错误通知等
        
        break;

      case "processing":
        console.log("🔄 任务处理中:", {
          id,
          started_at,
        });
        break;

      case "canceled":
        console.log("⏹️ 任务已取消:", {
          id,
          completed_at,
        });
        break;

      default:
        console.log("ℹ️ 任务状态更新:", {
          id,
          status,
        });
    }

    // 返回成功响应
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("💥 Webhook 处理错误:", error);
    return NextResponse.json(
      { error: "Webhook 处理失败" },
      { status: 500 }
    );
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  console.log('🌐 处理CORS预检请求');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, webhook-id, webhook-timestamp, webhook-signature',
    },
  });
} 