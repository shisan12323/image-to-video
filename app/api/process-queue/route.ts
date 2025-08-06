export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import { taskQueueService } from '@/services/task-queue';
import { replicateVideoService } from '@/services/replicate-video';

export async function POST(request: NextRequest) {
  console.log('⚙️ 收到队列处理请求');
  
  try {
    // 验证请求（可以添加API密钥验证）
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('⚠️ 未授权访问，缺少Authorization头');
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== process.env.QUEUE_PROCESSOR_TOKEN) {
      console.warn('⚠️ 无效的访问令牌');
      return NextResponse.json(
        { error: '无效的访问令牌' },
        { status: 401 }
      );
    }

    console.log('✅ 身份验证通过');

    // 获取下一个待处理任务
    console.log('🔍 开始获取下一个待处理任务...');
    const task = await taskQueueService.getNextTask();
    
    if (!task) {
      console.log('📭 没有待处理的任务');
      return NextResponse.json({
        success: true,
        message: '没有待处理的任务',
        processed: false
      });
    }

    console.log('✅ 获取到待处理任务:', {
      taskId: task.id,
      userId: task.userId,
      priority: task.priority,
      prompt: task.prompt.substring(0, 30) + '...'
    });

    // 更新任务状态为处理中
    console.log('🔄 更新任务状态为处理中...');
    await taskQueueService.updateTaskStatus(task.id, 'processing');

    try {
      // 创建webhook URL
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/replicate`;
      console.log('🔗 Webhook URL:', webhookUrl);
      
      // 启动Replicate视频生成任务
      console.log('🚀 开始调用Replicate API...');
      const replicateResponse = await replicateVideoService.startVideoGeneration({
        image: task.image,
        prompt: task.prompt,
        webhook: webhookUrl,
        webhook_events_filter: ['completed', 'failed'],
      });

      console.log('✅ Replicate API调用成功:', {
        replicateTaskId: replicateResponse.id,
        status: replicateResponse.status
      });

      // 更新任务状态，添加replicate_task_id
      console.log('💾 更新任务状态，添加replicate_task_id...');
      await taskQueueService.updateTaskStatus(task.id, 'processing', {
        replicateTaskId: replicateResponse.id
      });

      console.log('✅ 任务处理成功完成');

      return NextResponse.json({
        success: true,
        message: '任务处理成功',
        processed: true,
        taskId: task.id,
        replicateTaskId: replicateResponse.id
      });

    } catch (error) {
      console.error('❌ 处理任务失败:', error);
      
      // 更新任务状态为失败
      console.log('🔄 更新任务状态为失败...');
      await taskQueueService.updateTaskStatus(task.id, 'failed', {
        errorMessage: error instanceof Error ? error.message : '未知错误'
      });

      return NextResponse.json({
        success: false,
        message: '任务处理失败',
        processed: true,
        taskId: task.id,
        error: error instanceof Error ? error.message : '未知错误'
      });
    }

  } catch (error) {
    console.error('💥 队列处理器错误:', error);
    return NextResponse.json(
      { error: '队列处理器错误' },
      { status: 500 }
    );
  }
}

// 获取队列统计信息
export async function GET(request: NextRequest) {
  console.log('📊 收到队列统计请求');
  
  try {
    const stats = await taskQueueService.getQueueStats();
    
    console.log('✅ 队列统计获取成功:', stats);
    
    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('💥 获取队列统计错误:', error);
    return NextResponse.json(
      { error: '获取队列统计失败' },
      { status: 500 }
    );
  }
} 