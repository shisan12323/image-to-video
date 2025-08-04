import { NextRequest, NextResponse } from 'next/server';
import { replicateVideoService } from '@/services/replicate-video';
import { createClient } from '@supabase/supabase-js';

// 初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, prompt, userId } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: '缺少必要参数: image 和 prompt' },
        { status: 400 }
      );
    }

    // 生成任务ID
    const taskId = crypto.randomUUID();
    
    // 创建webhook URL
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/replicate`;
    
    // 启动Replicate视频生成任务
    const replicateResponse = await replicateVideoService.startVideoGeneration({
      image,
      prompt,
      webhook: webhookUrl,
      webhook_events_filter: ['completed', 'failed'],
    });

    // 将任务信息保存到Supabase
    const { error: dbError } = await supabase
      .from('video_tasks')
      .insert({
        id: taskId,
        user_uuid: userId,
        status: 'pending',
        input_image_url: image,
        prompt,
        replicate_task_id: replicateResponse.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('数据库保存失败:', dbError);
      return NextResponse.json(
        { error: '任务创建失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      taskId,
      replicateTaskId: replicateResponse.id,
      status: 'pending',
      message: '视频生成任务已启动',
    });

  } catch (error) {
    console.error('视频生成API错误:', error);
    return NextResponse.json(
      { error: '视频生成任务启动失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: '缺少taskId参数' },
        { status: 400 }
      );
    }

    // 从数据库查询任务状态
    const { data: task, error } = await supabase
      .from('video_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error || !task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      );
    }

    // 如果有replicate_task_id，也查询Replicate的状态
    let replicateStatus = null;
    if (task.replicate_task_id) {
      try {
        replicateStatus = await replicateVideoService.getTaskStatus(task.replicate_task_id);
      } catch (error) {
        console.error('查询Replicate状态失败:', error);
      }
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      inputImageUrl: task.input_image_url,
      outputVideoUrl: task.output_video_url,
      prompt: task.prompt,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      replicateStatus,
    });

  } catch (error) {
    console.error('查询任务状态错误:', error);
    return NextResponse.json(
      { error: '查询任务状态失败' },
      { status: 500 }
    );
  }
} 