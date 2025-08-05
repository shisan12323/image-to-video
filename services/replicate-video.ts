import Replicate from "replicate";

export interface ReplicateVideoInput {
  image: string; // 图片URL或base64
  prompt: string; // 视频描述
  webhook?: string; // webhook URL
  webhook_events_filter?: string[]; // 回调事件类型
}

export interface ReplicateVideoResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string; // 视频URL
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export class ReplicateVideoService {
  private replicate: Replicate;

  constructor(apiToken: string) {
    this.replicate = new Replicate({
      auth: apiToken,
    });
  }

  /**
   * 启动视频生成任务
   */
  async startVideoGeneration(input: ReplicateVideoInput): Promise<ReplicateVideoResponse> {
    try {
      const prediction = await this.replicate.predictions.create({
        version: "wan-video/wan-2.2-i2v-fast",
        input: {
          image: input.image,
          prompt: input.prompt,
        },
        webhook: input.webhook,
        webhook_events_filter: (input.webhook_events_filter || ["completed"]) as any,
      });

      return {
        id: prediction.id,
        status: prediction.status,
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at,
        output: prediction.output as string,
        error: prediction.error as string | undefined,
      };
    } catch (error) {
      console.error("Replicate API调用失败:", error);
      throw new Error(`视频生成任务启动失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string): Promise<ReplicateVideoResponse> {
    try {
      const prediction = await this.replicate.predictions.get(taskId);
      
      return {
        id: prediction.id,
        status: prediction.status,
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at,
        output: prediction.output as string,
        error: prediction.error as string | undefined,
      };
    } catch (error) {
      console.error("查询任务状态失败:", error);
      throw new Error(`查询任务状态失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<void> {
    try {
      await this.replicate.predictions.cancel(taskId);
    } catch (error) {
      console.error("取消任务失败:", error);
      throw new Error(`取消任务失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取任务列表
   */
  async getTaskList(limit: number = 10): Promise<ReplicateVideoResponse[]> {
    try {
      const predictions = await this.replicate.predictions.list();
      return predictions.results.slice(0, limit).map(prediction => ({
        id: prediction.id,
        status: prediction.status,
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at,
        output: prediction.output as string,
        error: prediction.error as string | undefined,
      }));
    } catch (error) {
      console.error("获取任务列表失败:", error);
      throw new Error(`获取任务列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 创建服务实例
export const replicateVideoService = new ReplicateVideoService(
  process.env.REPLICATE_API_TOKEN || ""
); 