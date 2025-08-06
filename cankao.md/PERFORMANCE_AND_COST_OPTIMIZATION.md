# 性能优化和成本控制方案

## 📊 存储成本分析

### Cloudflare R2 成本结构
- **免费额度**：10GB/月
- **超出费用**：$0.015/GB/月
- **请求费用**：$4.50/百万次请求
- **带宽费用**：$0.40/GB

### 成本预测示例
| 用户数量 | 每月视频数 | 存储需求 | 月费用 |
|---------|-----------|---------|--------|
| 100     | 500       | 15GB    | $0.08  |
| 500     | 2500      | 75GB    | $0.98  |
| 1000    | 5000      | 150GB   | $2.10  |
| 5000    | 25000     | 750GB   | $11.10 |

## 🚀 存储优化策略

### 1. 智能存储管理

```typescript
// services/storage-optimizer.ts
export class StorageOptimizerService {
  private r2Bucket: R2Bucket;
  private kv: KVNamespace;

  constructor(r2Bucket: R2Bucket, kv: KVNamespace) {
    this.r2Bucket = r2Bucket;
    this.kv = kv;
  }

  // 分级存储策略
  async implementTieredStorage(): Promise<void> {
    const videos = await this.r2Bucket.list({ prefix: 'videos/' });
    
    for (const video of videos.objects) {
      const accessCount = await this.getVideoAccessCount(video.key);
      const videoAge = await this.getVideoAge(video.key);
      
      // 根据访问频率和年龄决定存储策略
      if (accessCount < 5 && videoAge > 7) {
        // 冷数据：压缩存储
        await this.compressVideo(video.key);
      } else if (accessCount < 1 && videoAge > 30) {
        // 超冷数据：删除
        await this.deleteVideo(video.key);
      }
    }
  }

  // 视频压缩
  private async compressVideo(videoKey: string): Promise<void> {
    const video = await this.r2Bucket.get(videoKey);
    if (video) {
      // 使用WebM格式压缩（比MP4小30-50%）
      const compressedVideo = await this.compressToWebM(video);
      await this.r2Bucket.put(`${videoKey}.compressed`, compressedVideo);
      await this.r2Bucket.delete(videoKey);
    }
  }

  // 自动清理过期文件
  async cleanupExpiredVideos(): Promise<void> {
    const videos = await this.r2Bucket.list({ prefix: 'videos/' });
    const now = Date.now();
    
    for (const video of videos.objects) {
      const metadata = await this.getVideoMetadata(video.key);
      const ageInDays = (now - metadata.createdAt) / (1000 * 60 * 60 * 24);
      
      // 删除超过30天的视频
      if (ageInDays > 30) {
        await this.r2Bucket.delete(video.key);
        await this.recordVideoDeletion(video.key);
      }
    }
  }
}
```

### 2. 用户存储限制

```typescript
// services/user-storage-manager.ts
export class UserStorageManager {
  private r2Bucket: R2Bucket;
  private kv: KVNamespace;

  constructor(r2Bucket: R2Bucket, kv: KVNamespace) {
    this.r2Bucket = r2Bucket;
    this.kv = kv;
  }

  // 检查用户存储配额
  async checkUserStorageQuota(userId: string): Promise<{
    canUpload: boolean;
    currentUsage: number;
    maxQuota: number;
    reason?: string;
  }> {
    const currentUsage = await this.calculateUserStorage(userId);
    const maxQuota = await this.getUserQuota(userId);

    if (currentUsage >= maxQuota) {
      return {
        canUpload: false,
        currentUsage,
        maxQuota,
        reason: '存储空间不足，请删除旧视频或升级套餐'
      };
    }

    return {
      canUpload: true,
      currentUsage,
      maxQuota
    };
  }

  // 获取用户存储配额
  private async getUserQuota(userId: string): Promise<number> {
    const user = await this.getUserInfo(userId);
    
    switch (user.tier) {
      case 'free':
        return 100 * 1024 * 1024; // 100MB
      case 'premium':
        return 1024 * 1024 * 1024; // 1GB
      case 'pro':
        return 10 * 1024 * 1024 * 1024; // 10GB
      default:
        return 100 * 1024 * 1024; // 100MB
    }
  }
}
```

## ⚡ 视频生成性能优化

### 1. 智能任务调度

```typescript
// services/smart-scheduler.ts
export class SmartSchedulerService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  // 智能任务优先级
  async assignTaskPriority(task: VideoTask): Promise<number> {
    let priority = 0;
    
    // 付费用户优先级更高
    const userTier = await this.getUserTier(task.userId);
    if (userTier === 'premium') priority += 100;
    if (userTier === 'pro') priority += 200;
    
    // 等待时间越长优先级越高
    const waitTime = Date.now() - new Date(task.createdAt).getTime();
    priority += Math.floor(waitTime / 60000); // 每分钟+1分
    
    // 任务复杂度（根据prompt长度和图片大小）
    priority += task.prompt.length / 100;
    
    return priority;
  }

  // 批量处理优化
  async batchProcessTasks(): Promise<void> {
    const tasks = await this.getPendingTasks();
    const batches = this.groupTasksByComplexity(tasks);
    
    for (const batch of batches) {
      // 同时处理相似复杂度的任务
      await Promise.all(batch.map(task => this.processTask(task)));
    }
  }

  // 预测处理时间
  async estimateProcessingTime(task: VideoTask): Promise<number> {
    const complexity = this.calculateTaskComplexity(task);
    const systemLoad = await this.getSystemLoad();
    
    // 基础时间 + 复杂度系数 + 系统负载系数
    return 120 + (complexity * 30) + (systemLoad * 60);
  }
}
```

### 2. 缓存和去重

```typescript
// services/video-cache.ts
export class VideoCacheService {
  private kv: KVNamespace;
  private r2Bucket: R2Bucket;

  constructor(kv: KVNamespace, r2Bucket: R2Bucket) {
    this.kv = kv;
    this.r2Bucket = r2Bucket;
  }

  // 检查是否有相同请求的缓存
  async checkCache(imageHash: string, promptHash: string): Promise<string | null> {
    const cacheKey = `cache:${imageHash}:${promptHash}`;
    const cachedVideo = await this.kv.get(cacheKey);
    
    if (cachedVideo) {
      // 增加缓存命中统计
      await this.incrementCacheHit(cacheKey);
      return cachedVideo;
    }
    
    return null;
  }

  // 缓存视频结果
  async cacheVideo(imageHash: string, promptHash: string, videoUrl: string): Promise<void> {
    const cacheKey = `cache:${imageHash}:${promptHash}`;
    await this.kv.put(cacheKey, videoUrl, {
      expirationTtl: 86400 * 7 // 7天过期
    });
  }

  // 智能缓存清理
  async cleanupCache(): Promise<void> {
    const cacheEntries = await this.kv.list({ prefix: 'cache:' });
    
    for (const entry of cacheEntries.keys) {
      const hitCount = await this.getCacheHitCount(entry.name);
      const lastAccessed = await this.getLastAccessed(entry.name);
      
      // 删除低访问率的缓存
      if (hitCount < 2 && lastAccessed < Date.now() - 86400 * 3) {
        await this.kv.delete(entry.name);
      }
    }
  }
}
```

## 💰 成本控制策略

### 1. 动态定价模型

```typescript
// services/cost-manager.ts
export class CostManagerService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  // 计算任务成本
  async calculateTaskCost(task: VideoTask): Promise<number> {
    const baseCost = 0.01; // 基础成本 $0.01
    const complexityCost = this.calculateComplexityCost(task);
    const storageCost = await this.calculateStorageCost(task);
    
    return baseCost + complexityCost + storageCost;
  }

  // 用户积分系统
  async deductUserCredits(userId: string, cost: number): Promise<boolean> {
    const userCredits = await this.getUserCredits(userId);
    
    if (userCredits >= cost) {
      await this.updateUserCredits(userId, userCredits - cost);
      return true;
    }
    
    return false;
  }

  // 成本监控和告警
  async monitorCosts(): Promise<void> {
    const dailyCost = await this.getDailyCost();
    const monthlyCost = await this.getMonthlyCost();
    
    // 设置成本阈值告警
    if (dailyCost > 10) { // 日成本超过$10
      await this.sendCostAlert('daily', dailyCost);
    }
    
    if (monthlyCost > 200) { // 月成本超过$200
      await this.sendCostAlert('monthly', monthlyCost);
    }
  }
}
```

### 2. 资源使用优化

```typescript
// services/resource-optimizer.ts
export class ResourceOptimizerService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  // 优化并发设置
  async optimizeConcurrency(): Promise<void> {
    const systemMetrics = await this.getSystemMetrics();
    const costMetrics = await this.getCostMetrics();
    
    // 根据成本和性能动态调整并发数
    if (costMetrics.costPerTask > 0.02) {
      // 成本过高，减少并发
      await this.adjustConcurrency('decrease');
    } else if (systemMetrics.responseTime > 30000) {
      // 响应时间过长，增加并发
      await this.adjustConcurrency('increase');
    }
  }

  // 预测资源需求
  async predictResourceNeeds(): Promise<{
    storageNeeded: number;
    computeNeeded: number;
    costEstimate: number;
  }> {
    const userGrowth = await this.getUserGrowthRate();
    const usagePattern = await this.getUsagePattern();
    
    return {
      storageNeeded: this.calculateStorageNeeds(userGrowth, usagePattern),
      computeNeeded: this.calculateComputeNeeds(userGrowth, usagePattern),
      costEstimate: this.calculateCostEstimate(userGrowth, usagePattern)
    };
  }
}
```

## 📈 性能监控和优化

### 1. 实时性能监控

```typescript
// services/performance-monitor.ts
export class PerformanceMonitorService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  // 监控关键指标
  async monitorKeyMetrics(): Promise<{
    avgProcessingTime: number;
    successRate: number;
    costPerTask: number;
    storageUsage: number;
    queueLength: number;
  }> {
    const metrics = await this.collectMetrics();
    
    // 记录性能数据
    await this.recordMetrics(metrics);
    
    // 检查性能阈值
    await this.checkPerformanceThresholds(metrics);
    
    return metrics;
  }

  // 性能优化建议
  async generateOptimizationSuggestions(): Promise<string[]> {
    const suggestions: string[] = [];
    const metrics = await this.getRecentMetrics();
    
    if (metrics.avgProcessingTime > 300000) { // 5分钟
      suggestions.push('考虑增加并发处理能力');
    }
    
    if (metrics.costPerTask > 0.02) {
      suggestions.push('优化视频生成参数以降低成本');
    }
    
    if (metrics.storageUsage > 0.8) {
      suggestions.push('实施更激进的存储清理策略');
    }
    
    return suggestions;
  }
}
```

### 2. 成本预测模型

```typescript
// services/cost-predictor.ts
export class CostPredictorService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  // 预测月度成本
  async predictMonthlyCost(): Promise<{
    storageCost: number;
    computeCost: number;
    apiCost: number;
    totalCost: number;
  }> {
    const userGrowth = await this.getUserGrowthRate();
    const avgTasksPerUser = await this.getAvgTasksPerUser();
    const avgStoragePerTask = await this.getAvgStoragePerTask();
    
    const predictedUsers = await this.predictUserCount();
    const predictedTasks = predictedUsers * avgTasksPerUser;
    
    return {
      storageCost: predictedTasks * avgStoragePerTask * 0.015, // R2存储成本
      computeCost: predictedTasks * 0.01, // 计算成本
      apiCost: predictedTasks * 0.005, // API调用成本
      totalCost: 0 // 计算总和
    };
  }

  // 成本优化建议
  async getCostOptimizationSuggestions(): Promise<string[]> {
    const suggestions: string[] = [];
    const currentCosts = await this.getCurrentCosts();
    
    if (currentCosts.storageCost > currentCosts.computeCost * 2) {
      suggestions.push('实施更激进的存储清理策略');
    }
    
    if (currentCosts.apiCost > currentCosts.computeCost) {
      suggestions.push('优化API调用频率，实施缓存策略');
    }
    
    return suggestions;
  }
}
```

## 🎯 实施优先级

### 阶段1：基础优化（1周）
1. **存储清理策略**：自动删除30天前的视频
2. **用户存储限制**：免费用户100MB，付费用户更多
3. **基础缓存**：缓存相同请求的视频
4. **成本监控**：基础成本统计

### 阶段2：性能优化（2周）
1. **智能调度**：根据用户等级和等待时间分配优先级
2. **批量处理**：相似任务批量处理
3. **压缩优化**：冷数据自动压缩
4. **性能监控**：实时性能指标

### 阶段3：高级优化（3周）
1. **预测模型**：成本和使用量预测
2. **动态调整**：根据成本自动调整并发
3. **智能缓存**：基于访问频率的缓存策略
4. **成本控制**：积分系统和动态定价

## 📊 预期效果

### 存储成本降低
- **压缩策略**：减少30-50%存储空间
- **清理策略**：自动删除过期文件
- **分级存储**：热数据优先，冷数据压缩

### 性能提升
- **智能调度**：减少20-30%平均等待时间
- **缓存机制**：相同请求秒级响应
- **批量处理**：提高30-40%处理效率

### 成本控制
- **动态定价**：根据使用量调整价格
- **积分系统**：控制用户使用量
- **成本监控**：实时监控和告警

这个方案可以显著降低存储成本，提高视频生成性能，同时保持良好的用户体验。 