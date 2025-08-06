export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import { taskQueueService } from '@/services/task-queue';
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

  console.log('🔐 Webhook签名验证:', {
    hasSignature: !!signature,
    hasTimestamp: !!timestamp,
    hasBodySignature: !!bodySignature
  });

  if (!signature || !timestamp || !bodySignature) {
    console.warn('⚠️ Webhook签名验证失败：缺少必要头部');
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
    const isValid = bodySignature === expectedSignature;
    console.log('🔐 签名验证结果:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('💥 Webhook signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('📨 收到Replicate Webhook请求');
  
  try {
    const body = await request.text();
    console.log('📋 Webhook请求体长度:', body.length);
    
    // 验证webhook签名
    console.log('🔐 开始验证Webhook签名...');
    if (!(await verifyWebhookSignature(request, body))) {
      console.error('❌ Webhook签名验证失败');
      return NextResponse.json(
        { error: '签名验证失败' },
        { status: 401 }
      );
    }

    console.log('✅ Webhook签名验证通过');

    const payload = JSON.parse(body);
    console.log('📦 Webhook payload:', {
      id: payload.id,
      status: payload.status,
      hasOutput: !!payload.output,
      hasError: !!payload.error
    });

    const { id: replicateTaskId, status, output, error } = payload;

    if (!replicateTaskId) {
      console.warn('⚠️ 缺少任务ID');
      return NextResponse.json(
        { error: '缺少任务ID' },
        { status: 400 }
      );
    }

    // 根据Replicate任务状态更新数据库
    let dbStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled' = 'pending';
    let outputVideoUrl = null;

    console.log('🔄 处理任务状态:', status);
    
    switch (status) {
      case 'succeeded':
        dbStatus = 'completed';
        outputVideoUrl = output;
        console.log('✅ 任务成功完成，输出URL:', outputVideoUrl);
        break;
      case 'failed':
        dbStatus = 'failed';
        console.log('❌ 任务失败:', error);
        break;
      case 'canceled':
        dbStatus = 'canceled';
        console.log('🚫 任务被取消');
        break;
      case 'processing':
        dbStatus = 'processing';
        console.log('⚙️ 任务处理中');
        break;
      default:
        dbStatus = 'pending';
        console.log('⏳ 任务等待中');
    }

    // 查找对应的任务并更新状态
    console.log('🔍 查找对应的任务:', replicateTaskId);
    const { data: tasks, error: findError } = await supabase
      .from('video_tasks')
      .select('id')
      .eq('replicate_task_id', replicateTaskId);

    if (findError || !tasks || tasks.length === 0) {
      console.error('❌ 找不到对应的任务:', replicateTaskId);
      return NextResponse.json(
        { error: '找不到对应的任务' },
        { status: 404 }
      );
    }

    const taskId = tasks[0].id;
    console.log('✅ 找到对应任务:', taskId);

    // 使用任务队列服务更新状态
    console.log('💾 更新任务状态:', { taskId, dbStatus });
    const updateSuccess = await taskQueueService.updateTaskStatus(taskId, dbStatus, {
      outputVideoUrl,
      errorMessage: error || null,
    });

    if (!updateSuccess) {
      console.error('❌ 更新任务状态失败:', taskId);
      return NextResponse.json(
        { error: '数据库更新失败' },
        { status: 500 }
      );
    }

    console.log('✅ 任务状态更新成功:', {
      taskId,
      replicateTaskId,
      status: dbStatus,
      timestamp: new Date().toISOString()
    });

    // 如果任务完成，可以在这里添加额外的处理逻辑
    // 比如发送邮件通知、更新用户积分等

    return NextResponse.json({
      success: true,
      message: 'Webhook处理成功',
      taskId,
      status: dbStatus,
    });

  } catch (error) {
    console.error('💥 Webhook处理错误:', error);
    return NextResponse.json(
      { error: 'Webhook处理失败' },
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