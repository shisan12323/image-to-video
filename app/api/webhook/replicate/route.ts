export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// 初始化Supabase客户端
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook密钥验证
const WEBHOOK_SECRET = process.env.REPLICATE_WEBHOOK_SECRET || 'whsec_XZfvbR93GmNdK9f37I0ppNqxU+IeuzCC';

async function verifyWebhookSignature(request: NextRequest, body: string): Promise<boolean> {
  const signature = request.headers.get('webhook-id') || '';
  const timestamp = request.headers.get('webhook-timestamp') || '';
  const bodySignature = request.headers.get('webhook-signature') || '';

  if (!signature || !timestamp || !bodySignature) {
    return false;
  }

  try {
    // 构建签名字符串
    const signedContent = `${timestamp}.${body}`;
    
    // 使用 Web Crypto API (Edge Runtime 兼容)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(WEBHOOK_SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureData = encoder.encode(signedContent);
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, signatureData);
    
    // 转换为 hex
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // 简单的字符串比较 (在生产环境中应该使用 timingSafeEqual)
    return bodySignature === expectedSignature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // 验证webhook签名
    if (!(await verifyWebhookSignature(request, body))) {
      console.error('Webhook签名验证失败');
      return NextResponse.json(
        { error: '签名验证失败' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    console.log('收到Replicate webhook:', payload);

    const { id: replicateTaskId, status, output, error } = payload;

    if (!replicateTaskId) {
      return NextResponse.json(
        { error: '缺少任务ID' },
        { status: 400 }
      );
    }

    // 根据Replicate任务状态更新数据库
    let dbStatus = 'pending';
    let outputVideoUrl = null;

    switch (status) {
      case 'succeeded':
        dbStatus = 'completed';
        outputVideoUrl = output;
        break;
      case 'failed':
        dbStatus = 'failed';
        break;
      case 'canceled':
        dbStatus = 'canceled';
        break;
      case 'processing':
        dbStatus = 'processing';
        break;
      default:
        dbStatus = 'pending';
    }

    // 更新数据库中的任务状态
    const { error: updateError } = await supabase
      .from('video_tasks')
      .update({
        status: dbStatus,
        output_video_url: outputVideoUrl,
        updated_at: new Date().toISOString(),
        error_message: error || null,
      })
      .eq('replicate_task_id', replicateTaskId);

    if (updateError) {
      console.error('更新任务状态失败:', updateError);
      return NextResponse.json(
        { error: '数据库更新失败' },
        { status: 500 }
      );
    }

    console.log(`任务 ${replicateTaskId} 状态更新为: ${dbStatus}`);

    // 如果任务完成，可以在这里添加额外的处理逻辑
    // 比如发送邮件通知、更新用户积分等

    return NextResponse.json({
      success: true,
      message: 'Webhook处理成功',
      taskId: replicateTaskId,
      status: dbStatus,
    });

  } catch (error) {
    console.error('Webhook处理错误:', error);
    return NextResponse.json(
      { error: 'Webhook处理失败' },
      { status: 500 }
    );
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, webhook-id, webhook-timestamp, webhook-signature',
    },
  });
} 