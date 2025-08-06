import { createClient } from '@supabase/supabase-js';

export interface VideoTask {
  id: string;
  userId: string;
  image: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
  priority: number;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  replicateTaskId?: string;
  outputVideoUrl?: string;
  errorMessage?: string;
}

export class TaskQueueService {
  private supabase: any;
  private maxQueueSize = 1000;
  private maxConcurrentTasks = 5;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('🚀 TaskQueueService 初始化完成');
  }

  // 添加任务到队列
  async addTask(task: Omit<VideoTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean;
    taskId?: string;
    error?: string;
  }> {
    console.log('📝 开始添加任务到队列:', {
      userId: task.userId,
      prompt: task.prompt.substring(0, 50) + '...',
      status: task.status
    });

    try {
      // 检查队列大小
      const queueSize = await this.getQueueSize();
      console.log('📊 当前队列大小:', queueSize);
      
      if (queueSize >= this.maxQueueSize) {
        console.warn('⚠️ 队列已满，拒绝新任务');
        return {
          success: false,
          error: '任务队列已满，请稍后重试'
        };
      }

      // 检查用户并发限制
      const userActiveTasks = await this.getUserActiveTaskCount(task.userId);
      console.log('👤 用户活跃任务数:', userActiveTasks);
      
      if (userActiveTasks >= 3) {
        console.warn('⚠️ 用户任务数超限:', task.userId);
        return {
          success: false,
          error: '您同时只能处理3个视频任务'
        };
      }

      // 计算优先级
      const priority = await this.calculatePriority(task);
      console.log('🎯 计算任务优先级:', priority);

      // 插入任务到数据库
      console.log('💾 开始插入任务到数据库...');
      const { data, error } = await this.supabase
        .from('video_tasks')
        .insert({
          user_uuid: task.userId,
          status: task.status,
          input_image_url: task.image,
          prompt: task.prompt,
          priority: priority,
          retry_count: task.retryCount || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ 添加任务到队列失败:', error);
        return {
          success: false,
          error: '任务创建失败'
        };
      }

      console.log('✅ 任务成功添加到队列:', {
        taskId: data.id,
        priority: priority,
        queueSize: queueSize + 1
      });

      return {
        success: true,
        taskId: data.id
      };

    } catch (error) {
      console.error('💥 任务队列服务错误:', error);
      return {
        success: false,
        error: '任务队列服务错误'
      };
    }
  }

  // 获取下一个待处理任务
  async getNextTask(): Promise<VideoTask | null> {
    console.log('🔍 开始获取下一个待处理任务...');
    
    try {
      // 检查当前活跃任务数量
      const activeTasks = await this.getActiveTaskCount();
      console.log('⚡ 当前活跃任务数:', activeTasks);
      
      if (activeTasks >= this.maxConcurrentTasks) {
        console.log('⏸️ 达到并发限制，无法处理新任务');
        return null; // 达到并发限制
      }

      // 获取优先级最高的待处理任务
      console.log('🎯 查询优先级最高的待处理任务...');
      const { data, error } = await this.supabase
        .from('video_tasks')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error || !data) {
        console.log('📭 没有找到待处理的任务');
        return null;
      }

      const videoTask = this.mapDatabaseTaskToVideoTask(data);
      console.log('✅ 获取到下一个任务:', {
        taskId: videoTask.id,
        userId: videoTask.userId,
        priority: videoTask.priority,
        prompt: videoTask.prompt.substring(0, 30) + '...'
      });

      return videoTask;

    } catch (error) {
      console.error('💥 获取下一个任务失败:', error);
      return null;
    }
  }

  // 更新任务状态
  async updateTaskStatus(taskId: string, status: VideoTask['status'], additionalData?: {
    replicateTaskId?: string;
    outputVideoUrl?: string;
    errorMessage?: string;
  }): Promise<boolean> {
    console.log('🔄 开始更新任务状态:', {
      taskId,
      status,
      additionalData: additionalData ? Object.keys(additionalData) : 'none'
    });

    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (additionalData) {
        if (additionalData.replicateTaskId) {
          updateData.replicate_task_id = additionalData.replicateTaskId;
        }
        if (additionalData.outputVideoUrl) {
          updateData.output_video_url = additionalData.outputVideoUrl;
        }
        if (additionalData.errorMessage) {
          updateData.error_message = additionalData.errorMessage;
        }
      }

      const { error } = await this.supabase
        .from('video_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) {
        console.error('❌ 更新任务状态失败:', error);
        return false;
      }

      console.log('✅ 任务状态更新成功:', {
        taskId,
        status,
        timestamp: new Date().toISOString()
      });

      return true;

    } catch (error) {
      console.error('💥 更新任务状态错误:', error);
      return false;
    }
  }

  // 获取任务信息
  async getTask(taskId: string): Promise<VideoTask | null> {
    console.log('🔍 查询任务信息:', taskId);
    
    try {
      const { data, error } = await this.supabase
        .from('video_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error || !data) {
        console.log('❌ 任务不存在:', taskId);
        return null;
      }

      const videoTask = this.mapDatabaseTaskToVideoTask(data);
      console.log('✅ 获取任务信息成功:', {
        taskId: videoTask.id,
        status: videoTask.status,
        priority: videoTask.priority
      });

      return videoTask;

    } catch (error) {
      console.error('💥 获取任务信息失败:', error);
      return null;
    }
  }

  // 获取用户的任务列表
  async getUserTasks(userId: string, limit: number = 10): Promise<VideoTask[]> {
    console.log('👤 获取用户任务列表:', { userId, limit });
    
    try {
      const { data, error } = await this.supabase
        .from('video_tasks')
        .select('*')
        .eq('user_uuid', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ 获取用户任务失败:', error);
        return [];
      }

      const tasks = data.map((task: any) => this.mapDatabaseTaskToVideoTask(task));
      console.log('✅ 获取用户任务成功:', {
        userId,
        taskCount: tasks.length
      });

      return tasks;

    } catch (error) {
      console.error('💥 获取用户任务错误:', error);
      return [];
    }
  }

  // 清理过期任务
  async cleanupExpiredTasks(): Promise<void> {
    console.log('🧹 开始清理过期任务...');
    
    try {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 7); // 7天前的任务

      const { error } = await this.supabase
        .from('video_tasks')
        .delete()
        .lt('created_at', expiredDate.toISOString())
        .in('status', ['completed', 'failed', 'canceled']);

      if (error) {
        console.error('❌ 清理过期任务失败:', error);
      } else {
        console.log('✅ 过期任务清理完成');
      }

    } catch (error) {
      console.error('💥 清理过期任务错误:', error);
    }
  }

  // 获取队列统计信息
  async getQueueStats(): Promise<{
    totalTasks: number;
    pendingTasks: number;
    activeTasks: number;
    completedTasks: number;
    failedTasks: number;
  }> {
    console.log('📊 获取队列统计信息...');
    
    try {
      const { data, error } = await this.supabase
        .from('video_tasks')
        .select('status');

      if (error) {
        console.error('❌ 获取队列统计失败:', error);
        return {
          totalTasks: 0,
          pendingTasks: 0,
          activeTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
        };
      }

      const stats = {
        totalTasks: data.length,
        pendingTasks: data.filter((task: any) => task.status === 'pending').length,
        activeTasks: data.filter((task: any) => task.status === 'processing').length,
        completedTasks: data.filter((task: any) => task.status === 'completed').length,
        failedTasks: data.filter((task: any) => task.status === 'failed').length,
      };

      console.log('✅ 队列统计信息:', stats);
      return stats;

    } catch (error) {
      console.error('💥 获取队列统计错误:', error);
      return {
        totalTasks: 0,
        pendingTasks: 0,
        activeTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
      };
    }
  }

  // 私有方法：计算任务优先级
  private async calculatePriority(task: Omit<VideoTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    console.log('🎯 开始计算任务优先级...');
    
    let priority = 0;

    // 获取用户等级
    const { data: user } = await this.supabase
      .from('users')
      .select('tier')
      .eq('uuid', task.userId)
      .single();

    // 根据用户等级设置基础优先级
    if (user?.tier === 'premium') {
      priority += 100;
      console.log('👑 付费用户，优先级 +100');
    } else if (user?.tier === 'pro') {
      priority += 200;
      console.log('💎 Pro用户，优先级 +200');
    } else {
      console.log('👤 免费用户，基础优先级');
    }

    // 根据重试次数调整优先级（重试次数越多优先级越高）
    const retryBonus = (task.retryCount || 0) * 10;
    priority += retryBonus;
    if (retryBonus > 0) {
      console.log('🔄 重试次数奖励:', retryBonus);
    }

    // 根据prompt长度调整优先级（复杂任务优先级稍高）
    const complexityBonus = Math.min(task.prompt.length / 100, 10);
    priority += complexityBonus;
    if (complexityBonus > 0) {
      console.log('📝 复杂度奖励:', complexityBonus);
    }

    console.log('🎯 最终优先级:', priority);
    return priority;
  }

  // 私有方法：获取队列大小
  private async getQueueSize(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('video_tasks')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'processing']);

      if (error) {
        console.error('❌ 获取队列大小失败:', error);
        return 0;
      }

      return count || 0;

    } catch (error) {
      console.error('💥 获取队列大小错误:', error);
      return 0;
    }
  }

  // 私有方法：获取活跃任务数量
  private async getActiveTaskCount(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('video_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'processing');

      if (error) {
        console.error('❌ 获取活跃任务数量失败:', error);
        return 0;
      }

      return count || 0;

    } catch (error) {
      console.error('💥 获取活跃任务数量错误:', error);
      return 0;
    }
  }

  // 私有方法：获取用户活跃任务数量
  private async getUserActiveTaskCount(userId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('video_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_uuid', userId)
        .in('status', ['pending', 'processing']);

      if (error) {
        console.error('❌ 获取用户活跃任务数量失败:', error);
        return 0;
      }

      return count || 0;

    } catch (error) {
      console.error('💥 获取用户活跃任务数量错误:', error);
      return 0;
    }
  }

  // 私有方法：映射数据库任务到VideoTask对象
  private mapDatabaseTaskToVideoTask(dbTask: any): VideoTask {
    return {
      id: dbTask.id,
      userId: dbTask.user_uuid,
      image: dbTask.input_image_url,
      prompt: dbTask.prompt,
      status: dbTask.status,
      priority: dbTask.priority || 0,
      createdAt: dbTask.created_at,
      updatedAt: dbTask.updated_at,
      retryCount: dbTask.retry_count || 0,
      replicateTaskId: dbTask.replicate_task_id,
      outputVideoUrl: dbTask.output_video_url,
      errorMessage: dbTask.error_message,
    };
  }
}

// 创建单例实例
export const taskQueueService = new TaskQueueService(); 