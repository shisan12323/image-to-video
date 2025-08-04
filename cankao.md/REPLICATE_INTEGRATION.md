# Replicate 视频生成集成指南

## 概述

本项目已集成 [Replicate wan-2.2-i2v-fast](https://replicate.com/wan-video/wan-2.2-i2v-fast) API，支持异步视频生成和webhook回调。

## 安装依赖

```bash
npm install replicate
```

## 环境变量配置

在 `.env.local` 文件中添加以下配置：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Replicate配置
REPLICATE_API_TOKEN=your_replicate_api_token
REPLICATE_WEBHOOK_SECRET=whsec_XZfvbR93GmNdK9f37I0ppNqxU+IeuzCC

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 数据库设置

在Supabase中执行以下SQL创建表：

```sql
-- 视频任务表
CREATE TABLE video_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  status text CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled')) DEFAULT 'pending',
  input_image_url text,
  output_video_url text,
  prompt text,
  replicate_task_id text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_video_tasks_user_id ON video_tasks(user_id);
CREATE INDEX idx_video_tasks_status ON video_tasks(status);
CREATE INDEX idx_video_tasks_replicate_task_id ON video_tasks(replicate_task_id);
```

## API使用示例

### 1. 启动视频生成任务

```javascript
const response = await fetch('/api/generate-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: 'https://example.com/image.jpg',
    prompt: '描述视频内容',
    userId: 'user-uuid'
  })
});

const result = await response.json();
console.log('任务ID:', result.taskId);
```

### 2. 查询任务状态

```javascript
const response = await fetch(`/api/generate-video?taskId=${taskId}`);
const status = await response.json();
console.log('任务状态:', status.status);
```

## 前端组件使用

```jsx
import { VideoTaskStatus } from '@/components/video-task-status';

function VideoGenerator() {
  const [taskId, setTaskId] = useState(null);

  const handleGenerate = async () => {
    // 启动生成任务
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      body: JSON.stringify({
        image: imageUrl,
        prompt: description,
        userId: 'user-id'
      })
    });
    
    const result = await response.json();
    setTaskId(result.taskId);
  };

  return (
    <div>
      {/* 生成按钮 */}
      <button onClick={handleGenerate}>生成视频</button>
      
      {/* 任务状态组件 */}
      {taskId && (
        <VideoTaskStatus 
          taskId={taskId}
          onComplete={(videoUrl) => console.log('视频完成:', videoUrl)}
          onError={(error) => console.error('生成失败:', error)}
        />
      )}
    </div>
  );
}
```

## Webhook配置

1. 在Replicate Dashboard中配置webhook URL：
   ```
   https://your-domain.com/api/webhook/replicate
   ```

2. 设置webhook密钥：
   ```
   whsec_XZfvbR93GmNdK9f37I0ppNqxU+IeuzCC
   ```

## 工作流程

1. **用户上传图片** → 前端调用 `/api/generate-video`
2. **API创建任务** → 保存到Supabase，调用Replicate API
3. **Replicate处理** → 异步生成视频
4. **Webhook回调** → 更新数据库状态
5. **前端轮询** → 显示任务进度和结果

## 错误处理

- API调用失败：检查 `REPLICATE_API_TOKEN`
- Webhook验证失败：检查 `REPLICATE_WEBHOOK_SECRET`
- 数据库错误：检查Supabase配置
- 任务超时：Replicate有处理时间限制

## 成本控制

- Replicate按使用量付费
- 建议设置使用限制
- 可以添加用户积分系统
- 考虑缓存相同提示词的结果

## 扩展功能

- 支持多种视频生成模型
- 添加视频质量选择
- 实现用户积分系统
- 添加邮件通知功能
- 支持批量处理 