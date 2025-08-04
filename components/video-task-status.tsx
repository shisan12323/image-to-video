'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock, Play } from 'lucide-react';

interface TaskStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
  inputImageUrl?: string;
  outputVideoUrl?: string;
  prompt?: string;
  createdAt?: string;
  updatedAt?: string;
  replicateStatus?: any;
}

interface VideoTaskStatusProps {
  taskId: string;
  onComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

export function VideoTaskStatus({ taskId, onComplete, onError }: VideoTaskStatusProps) {
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Play className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '生成完成';
      case 'failed':
        return '生成失败';
      case 'processing':
        return '正在生成';
      case 'pending':
        return '等待处理';
      case 'canceled':
        return '已取消';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const checkTaskStatus = async () => {
    try {
      const response = await fetch(`/api/generate-video?taskId=${taskId}`);
      if (!response.ok) {
        throw new Error('查询任务状态失败');
      }
      
      const data = await response.json();
      setTaskStatus(data);
      setLoading(false);

      // 如果任务完成，调用回调
      if (data.status === 'completed' && data.outputVideoUrl) {
        onComplete?.(data.outputVideoUrl);
      } else if (data.status === 'failed') {
        onError?.('视频生成失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
      setLoading(false);
    }
  };

  useEffect(() => {
    // 立即检查一次
    checkTaskStatus();

    // 设置轮询间隔
    const interval = setInterval(() => {
      if (taskStatus?.status === 'completed' || taskStatus?.status === 'failed') {
        clearInterval(interval);
        return;
      }
      checkTaskStatus();
    }, 5000); // 每5秒检查一次

    return () => clearInterval(interval);
  }, [taskId, taskStatus?.status]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span>正在查询任务状态...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">错误: {error}</span>
        </div>
        <Button 
          onClick={checkTaskStatus} 
          variant="outline" 
          className="mt-3"
        >
          重试
        </Button>
      </Card>
    );
  }

  if (!taskStatus) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          任务不存在
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* 状态显示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(taskStatus.status)}
            <div>
              <h3 className="font-semibold">任务状态</h3>
              <p className="text-sm text-gray-600">任务ID: {taskStatus.taskId}</p>
            </div>
          </div>
          <Badge className={getStatusColor(taskStatus.status)}>
            {getStatusText(taskStatus.status)}
          </Badge>
        </div>

        {/* 输入图片 */}
        {taskStatus.inputImageUrl && (
          <div>
            <h4 className="font-medium mb-2">输入图片</h4>
            <img 
              src={taskStatus.inputImageUrl} 
              alt="输入图片" 
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* 提示词 */}
        {taskStatus.prompt && (
          <div>
            <h4 className="font-medium mb-2">提示词</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {taskStatus.prompt}
            </p>
          </div>
        )}

        {/* 输出视频 */}
        {taskStatus.status === 'completed' && taskStatus.outputVideoUrl && (
          <div>
            <h4 className="font-medium mb-2">生成的视频</h4>
            <video 
              controls 
              className="w-full max-w-md rounded-lg"
              src={taskStatus.outputVideoUrl}
            >
              您的浏览器不支持视频播放
            </video>
            <Button 
              onClick={() => window.open(taskStatus.outputVideoUrl, '_blank')}
              className="mt-2"
            >
              在新窗口打开
            </Button>
          </div>
        )}

        {/* 时间信息 */}
        <div className="text-xs text-gray-500 space-y-1">
          {taskStatus.createdAt && (
            <p>创建时间: {new Date(taskStatus.createdAt).toLocaleString()}</p>
          )}
          {taskStatus.updatedAt && (
            <p>更新时间: {new Date(taskStatus.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </Card>
  );
} 