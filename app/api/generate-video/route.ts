export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import { replicateVideoService } from '@/services/replicate-video';
import { taskQueueService } from '@/services/task-queue';
import { createClient } from '@supabase/supabase-js';

// 初始化Supabase客户端
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  console.log('🎬 收到视频生成请求');
  
  try {
    const body = await request.json();
    const { image, prompt, userId } = body;

    console.log('📋 请求参数:', {
      hasImage: !!image,
      promptLength: prompt?.length || 0,
      userId: userId
    });

    if (!image || !prompt || !userId) {
      console.warn('⚠️ 缺少必要参数:', { image: !!image, prompt: !!prompt, userId: !!userId });
      return NextResponse.json(
        { error: '缺少必要参数: image、prompt 和 userId' },
        { status: 400 }
      );
    }

    // 生成任务ID
    const taskId = crypto.randomUUID();
    console.log('🆔 生成任务ID:', taskId);
    
    // 使用任务队列服务添加任务
    console.log('📝 开始添加任务到队列...');
    const queueResult = await taskQueueService.addTask({
      userId,
      image,
      prompt,
      status: 'pending',
      priority: 0, // 队列服务会自动计算优先级
      retryCount: 0,
    });

    if (!queueResult.success) {
      console.error('❌ 任务队列添加失败:', queueResult.error);
      return NextResponse.json(
        { error: queueResult.error },
        { status: 429 } // Too Many Requests
      );
    }

    console.log('✅ 任务成功添加到队列:', {
      taskId: queueResult.taskId,
      status: 'pending'
    });

    // 立即返回任务ID（不等待处理）
    return NextResponse.json({
      success: true,
      taskId: queueResult.taskId,
      status: 'pending',
      message: '视频生成任务已加入队列',
      estimatedWaitTime: '2-5分钟'
    });

  } catch (error) {
    console.error('💥 视频生成API错误:', error);
    return NextResponse.json(
      { error: '视频生成任务启动失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('🔍 收到任务状态查询请求');
  
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    console.log('📋 查询参数:', { taskId });

    if (!taskId) {
      console.warn('⚠️ 缺少taskId参数');
      return NextResponse.json(
        { error: '缺少taskId参数' },
        { status: 400 }
      );
    }

    // 使用任务队列服务获取任务信息
    console.log('🔍 开始查询任务信息...');
    const task = await taskQueueService.getTask(taskId);

    if (!task) {
      console.warn('⚠️ 任务不存在:', taskId);
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      );
    }

    console.log('✅ 获取任务信息成功:', {
      taskId: task.id,
      status: task.status,
      priority: task.priority
    });

    // 如果有replicate_task_id，也查询Replicate的状态
    let replicateStatus = null;
    if (task.replicateTaskId) {
      console.log('🔄 查询Replicate状态:', task.replicateTaskId);
      try {
        replicateStatus = await replicateVideoService.getTaskStatus(task.replicateTaskId);
        console.log('✅ Replicate状态查询成功:', replicateStatus?.status);
      } catch (error) {
        console.error('❌ 查询Replicate状态失败:', error);
      }
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      inputImageUrl: task.image,
      outputVideoUrl: task.outputVideoUrl,
      prompt: task.prompt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      priority: task.priority,
      retryCount: task.retryCount,
      replicateStatus,
    });

  } catch (error) {
    console.error('💥 查询任务状态错误:', error);
    return NextResponse.json(
      { error: '查询任务状态失败' },
      { status: 500 }
    );
  }
} 