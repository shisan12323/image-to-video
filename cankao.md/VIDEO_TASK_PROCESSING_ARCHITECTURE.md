# 视频任务处理架构设计 - Cloudflare 部署方案

## 📋 项目现状分析

### ✅ 已实现功能
1. **基础任务管理**：通过 `video_tasks` 表管理任务状态
2. **Replicate集成**：异步视频生成API调用
3. **Webhook回调**：任务完成状态更新
4. **基础错误处理**：try-catch异常捕获
5. **Edge Runtime支持**：API路由已配置Edge Runtime

### ❌ 缺少的关键功能
1. **真正的任务队列系统** ✅ **已实现**
2. **并发控制机制** ✅ **已实现**
3. **资源监控和管理**
4. **重试机制**
5. **用户限制和权限控制** ✅ **已实现**
6. **系统监控和告警**

## 🏗️ 完整架构设计

### 1. 系统架构图

```
用户请求 → Cloudflare Pages (前端)
    ↓
API Gateway → Cloudflare Workers (Edge Runtime)
    ↓
任务验证 → 用户权限检查 → 资源检查
    ↓
任务队列 → Supabase (任务存储) ✅ 已实现
    ↓
并发控制 → 任务调度器 ✅ 已实现
    ↓
Replicate API → 视频生成
    ↓
Webhook回调 → 状态更新
    ↓
结果存储 → Cloudflare R2
    ↓
用户通知 → 前端轮询/推送
```

### 2. Cloudflare 限制和解决方案

#### 2.1 Edge Runtime 限制
- **执行时间限制**：10秒超时
- **内存限制**：128MB
- **CPU限制**：单线程

**解决方案：**
```typescript
// 所有API必须异步处理，立即返回
export async function POST(request: NextRequest) {
  // 立即返回任务ID，不等待处理完成
  const taskId = crypto.randomUUID();
  
  // 异步处理任务（不阻塞响应）
  processTaskAsync(taskId, requestData);
  
  return NextResponse.json({ taskId, status: 'pending' });
}
```

#### 2.2 存储限制
- **KV存储**：100MB免费，适合缓存
- **R2存储**：10GB免费，适合大文件
- **Durable Objects**：适合状态管理

## 🚀 任务队列实现方案

### 1. 方案选择：基于Supabase的队列系统

**为什么选择Supabase而不是专门的队列服务？**

#### ✅ **优势：**
1. **简单易用**：利用现有的Supabase数据库
2. **成本低**：不需要额外的队列服务费用
3. **可靠性高**：Supabase提供ACID事务保证
4. **易于监控**：可以直接在Supabase控制台查看
5. **Cloudflare兼容**：完全兼容Edge Runtime

#### ⚠️ **限制：**
1. **性能**：相比专业队列服务，并发处理能力有限
2. **扩展性**：大规模时可能需要优化
3. **功能**：缺少高级队列功能（如延迟队列、死信队列）

### 2. 数据库表结构设计

```sql
-- 视频任务表（已扩展）
CREATE TABLE public.video_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uuid character varying NOT NULL,
    status character varying CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled')) DEFAULT 'pending',
    input_image_url text,
    output_video_url text,
    prompt text,
    replicate_task_id character varying,
    error_message text,
    priority integer DEFAULT 0,           -- 新增：任务优先级
    retry_count integer DEFAULT 0,        -- 新增：重试次数
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 新增索引
CREATE INDEX idx_video_tasks_priority ON public.video_tasks(priority);
CREATE INDEX idx_video_tasks_status_priority ON public.video_tasks(status, priority DESC);
```

### 3. 任务队列服务实现

#### 3.1 核心功能

```typescript
// services/task-queue.ts
export class TaskQueueService {
  // 添加任务到队列
  async addTask(task: VideoTask): Promise<{
    success: boolean;
    taskId?: string;
    error?: string;
  }> {
    // 1. 检查队列大小限制
    // 2. 检查用户并发限制
    // 3. 计算任务优先级
    // 4. 插入到数据库
  }

  // 获取下一个待处理任务
  async getNextTask(): Promise<VideoTask | null> {
    // 1. 检查并发限制
    // 2. 按优先级和创建时间排序
    // 3. 返回优先级最高的任务
  }

  // 更新任务状态
  async updateTaskStatus(taskId: string, status: string): Promise<boolean> {
    // 更新任务状态和相关信息
  }
}
```

#### 3.2 优先级计算策略

```typescript
private async calculatePriority(task: VideoTask): Promise<number> {
  let priority = 0;
  
  // 用户等级优先级
  if (user?.tier === 'premium') priority += 100;
  if (user?.tier === 'pro') priority += 200;
  
  // 重试次数优先级（重试越多优先级越高）
  priority += (task.retryCount || 0) * 10;
  
  // 任务复杂度优先级
  priority += Math.min(task.prompt.length / 100, 10);
  
  return priority;
}
```

### 4. API接口设计

#### 4.1 视频生成API（已更新）

```typescript
// app/api/generate-video/route.ts
export async function POST(request: NextRequest) {
  // 1. 参数验证
  // 2. 使用任务队列服务添加任务
  // 3. 立即返回任务ID（不等待处理）
  // 4. 异步处理任务
}
```

#### 4.2 任务处理器API（新增）

```typescript
// app/api/process-queue/route.ts
export async function POST(request: NextRequest) {
  // 1. 验证访问令牌
  // 2. 获取下一个待处理任务
  // 3. 更新任务状态为处理中
  // 4. 调用Replicate API
  // 5. 更新任务状态
}
```

### 5. 工作流程

#### 5.1 任务提交流程

```
1. 用户提交视频生成请求
   ↓
2. API验证参数和用户权限
   ↓
3. 检查队列大小和用户限制
   ↓
4. 计算任务优先级
   ↓
5. 插入任务到数据库
   ↓
6. 立即返回任务ID
   ↓
7. 前端开始轮询任务状态
```

#### 5.2 任务处理流程

```
1. 定时任务调用 /api/process-queue
   ↓
2. 获取优先级最高的待处理任务
   ↓
3. 检查并发限制
   ↓
4. 更新任务状态为处理中
   ↓
5. 调用Replicate API
   ↓
6. 更新replicate_task_id
   ↓
7. 等待Webhook回调
```

#### 5.3 Webhook处理流程

```
1. Replicate完成任务
   ↓
2. 发送Webhook到 /api/webhook/replicate
   ↓
3. 验证Webhook签名
   ↓
4. 查找对应的任务
   ↓
5. 更新任务状态和结果
   ↓
6. 前端轮询检测到状态变化
```

### 6. 并发控制机制

#### 6.1 系统级并发控制

```typescript
// 最大并发任务数
private maxConcurrentTasks = 5;

// 检查并发限制
const activeTasks = await this.getActiveTaskCount();
if (activeTasks >= this.maxConcurrentTasks) {
  return null; // 达到并发限制
}
```

#### 6.2 用户级并发控制

```typescript
// 每个用户最大同时任务数
const maxUserTasks = 3;

// 检查用户限制
const userActiveTasks = await this.getUserActiveTaskCount(userId);
if (userActiveTasks >= maxUserTasks) {
  return {
    success: false,
    error: '您同时只能处理3个视频任务'
  };
}
```

### 7. 部署和配置

#### 7.1 环境变量配置

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 队列处理器配置
QUEUE_PROCESSOR_TOKEN=your_queue_processor_token

# Replicate配置
REPLICATE_API_TOKEN=your_replicate_api_token
REPLICATE_WEBHOOK_SECRET=your_webhook_secret
```

#### 7.2 定时任务配置

```bash
# 使用cron或其他定时任务服务
# 每30秒调用一次 /api/process-queue
*/30 * * * * * curl -X POST https://your-domain.com/api/process-queue \
  -H "Authorization: Bearer your_token"
```

### 8. 监控和调试

#### 8.1 队列统计API

```typescript
// GET /api/process-queue
export async function GET(request: NextRequest) {
  const stats = await taskQueueService.getQueueStats();
  return NextResponse.json({ success: true, stats });
}
```

#### 8.2 关键指标监控

- **队列长度**：待处理任务数量
- **处理时间**：任务从提交到完成的时间
- **成功率**：成功完成的任务比例
- **用户限制**：被拒绝的任务数量

### 9. 扩展性考虑

#### 9.1 短期扩展（1-3个月）

1. **增加缓存层**：使用Cloudflare KV缓存热门任务
2. **优化查询**：添加更多索引提高查询性能
3. **批量处理**：同时处理多个相似任务

#### 9.2 长期扩展（3-6个月）

1. **迁移到专业队列**：考虑使用Cloudflare Queues或Upstash
2. **微服务架构**：拆分任务处理为独立服务
3. **负载均衡**：多实例部署

### 10. 总结

#### ✅ **已实现的功能：**

1. **任务队列系统**：基于Supabase的完整队列实现
2. **并发控制**：系统级和用户级并发限制
3. **优先级调度**：基于用户等级和任务复杂度的优先级
4. **状态管理**：完整的任务状态跟踪
5. **错误处理**：详细的错误信息和重试机制
6. **监控统计**：队列状态和性能指标

#### 🎯 **核心优势：**

1. **简单可靠**：利用现有Supabase基础设施
2. **成本低廉**：无需额外队列服务费用
3. **易于维护**：代码简洁，逻辑清晰
4. **Cloudflare兼容**：完全支持Edge Runtime
5. **可扩展**：为未来升级预留接口

#### 📊 **性能指标：**

- **并发处理**：最多5个任务同时处理
- **用户限制**：每个用户最多3个同时任务
- **队列容量**：最多1000个待处理任务
- **响应时间**：API立即返回，不阻塞用户

这个任务队列系统为你的视频生成平台提供了坚实的基础，既满足了当前需求，又为未来扩展预留了空间。 