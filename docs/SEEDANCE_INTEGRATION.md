# Seedance 1.0 Lite 集成指南

## 概述

本项目已集成 [Seedance 1.0 Lite](https://replicate.com/bytedance/seedance-1-lite) 模型，支持文本到视频 (T2V) 和图片到视频 (I2V) 的生成。

## 功能特性

- ✅ **文本到视频 (T2V)**: 从文本描述生成视频
- ✅ **图片到视频 (I2V)**: 从静态图片生成视频
- ✅ **异步处理**: 支持长时间运行的视频生成任务
- ✅ **Webhook 回调**: 任务完成后自动通知
- ✅ **多模型支持**: 可扩展支持其他 Replicate 模型
- ✅ **状态轮询**: 实时查询任务进度

## 环境配置

### 1. 安装依赖

```bash
npm install replicate --legacy-peer-deps
```

### 2. 环境变量

在 `.env.local` 中添加：

```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

## API 使用

### 启动视频生成任务

```typescript
// 文本到视频
const response = await fetch('/api/generate-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    modelType: 'seedance-lite',
    prompt: 'a woman walks in the park',
    num_frames: 150, // 5秒视频 (30fps)
    num_inference_steps: 20,
    guidance_scale: 7.5,
    width: 480,
    height: 720,
    webhook: 'https://your-domain.com/api/webhook/replicate'
  })
});

const result = await response.json();
const taskId = result.data.id;
```

### 图片到视频

```typescript
const response = await fetch('/api/generate-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    modelType: 'seedance-lite',
    prompt: 'make the image come alive with gentle movement',
    image: 'https://example.com/image.jpg',
    num_frames: 150,
    webhook: 'https://your-domain.com/api/webhook/replicate'
  })
});
```

### 查询任务状态

```typescript
const response = await fetch(`/api/generate-video?taskId=${taskId}`);
const result = await response.json();

console.log('任务状态:', result.data.status);
// 可能的状态: starting, processing, succeeded, failed, canceled

if (result.data.status === 'succeeded') {
  console.log('视频URL:', result.data.output);
}
```

## 参数说明

### Seedance Lite 参数

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `prompt` | string | ✅ | - | 视频描述文本 |
| `image` | string | ❌ | - | 图片URL (I2V模式) |
| `num_frames` | number | ❌ | 150 | 视频帧数 (5秒@30fps) |
| `num_inference_steps` | number | ❌ | 20 | 推理步数 |
| `guidance_scale` | number | ❌ | 7.5 | 引导比例 |
| `width` | number | ❌ | 480 | 视频宽度 |
| `height` | number | ❌ | 720 | 视频高度 |
| `webhook` | string | ❌ | - | 回调URL |

### 支持的模型类型

- `seedance-lite`: Seedance 1.0 Lite (推荐)
- `seedance`: Seedance 1.0 完整版
- `wan-video`: WAN Video 模型

## Webhook 处理

当任务完成时，系统会向指定的 webhook URL 发送 POST 请求：

```json
{
  "id": "task_id",
  "status": "succeeded",
  "output": "https://replicate.delivery/.../output.mp4",
  "created_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:05:00Z"
}
```

## 完整使用示例

参考 `examples/seedance-usage.ts` 文件中的完整示例。

## 错误处理

常见错误及解决方案：

1. **API Token 无效**
   - 检查 `REPLICATE_API_TOKEN` 环境变量
   - 确保 token 有足够的权限

2. **任务超时**
   - 增加轮询间隔时间
   - 检查网络连接

3. **内存不足**
   - 减少 `num_frames` 参数
   - 降低视频分辨率

## 扩展性

### 添加新模型

1. 在 `ModelType` 枚举中添加新模型
2. 在 `startVideoGeneration` 方法中添加对应的处理逻辑
3. 创建对应的输入接口类型

```typescript
// 在 replicate-video.ts 中添加
export enum ModelType {
  // ... 现有模型
  NEW_MODEL = "owner/new-model"
}

// 添加输入接口
export interface NewModelInput extends BaseReplicateInput {
  // 新模型的参数
}
```

### 自定义处理逻辑

在 `app/api/webhook/replicate/route.ts` 中添加自定义的处理逻辑：

```typescript
case "succeeded":
  // 自定义成功处理逻辑
  await updateDatabase(result.id, result.output);
  await sendNotification(userId, result.output);
  break;
```

## 性能优化

1. **并发控制**: 限制同时运行的任务数量
2. **缓存策略**: 缓存已生成的视频
3. **队列管理**: 使用任务队列管理大量请求
4. **CDN 加速**: 使用 CDN 加速视频下载

## 监控和日志

- 所有 API 调用都会记录详细日志
- Webhook 回调包含完整的任务信息
- 支持错误追踪和性能监控

## 安全考虑

1. **API Token 安全**: 不要在客户端暴露 API token
2. **Webhook 验证**: 验证 webhook 签名
3. **输入验证**: 验证用户输入参数
4. **速率限制**: 实施 API 调用频率限制 