import Replicate from "replicate";

// 支持的模型类型
export enum ModelType {
  WAN_VIDEO = "wan-video/wan-2.2-i2v-fast",
  SEEDANCE_LITE = "bytedance/seedance-1-lite",
  SEEDANCE = "bytedance/seedance-1.0"
}

// 基础输入接口
export interface BaseReplicateInput {
  webhook?: string;
  webhook_events_filter?: string[];
}

// WAN Video 输入接口
export interface WanVideoInput extends BaseReplicateInput {
  image: string; // 图片URL或base64
  prompt: string; // 视频描述
}

// Seedance 输入接口
export interface SeedanceInput extends BaseReplicateInput {
  prompt: string; // 视频描述
  image?: string; // 可选的图片URL（用于I2V模式）
  num_frames?: number; // 帧数，默认 5s 或 10s
  num_inference_steps?: number; // 推理步数
  guidance_scale?: number; // 引导比例
  width?: number; // 视频宽度
  height?: number; // 视频高度
}

// 通用输入类型
export type ReplicateVideoInput = WanVideoInput | SeedanceInput;

export interface ReplicateVideoResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string; // 视频URL
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  model_type?: ModelType; // 添加模型类型标识
}

export class ReplicateVideoService {
  private replicate: Replicate;

  constructor(apiToken: string) {
    this.replicate = new Replicate({
      auth: apiToken,
    });
  }

  /**
   * 启动视频生成任务 - 通用方法
   */
  async startVideoGeneration(
    modelType: ModelType,
    input: ReplicateVideoInput
  ): Promise<ReplicateVideoResponse> {
    try {
      let predictionInput: any = {};
      let version: string;

      switch (modelType) {
        case ModelType.WAN_VIDEO:
          version = ModelType.WAN_VIDEO;
          predictionInput = {
            image: (input as WanVideoInput).image,
            prompt: (input as WanVideoInput).prompt,
          };
          break;

        case ModelType.SEEDANCE_LITE:
        case ModelType.SEEDANCE:
          version = modelType;
          const seedanceInput = input as SeedanceInput;
          predictionInput = {
            prompt: seedanceInput.prompt,
            ...(seedanceInput.image && { image: seedanceInput.image }),
            ...(seedanceInput.num_frames && { num_frames: seedanceInput.num_frames }),
            ...(seedanceInput.num_inference_steps && { num_inference_steps: seedanceInput.num_inference_steps }),
            ...(seedanceInput.guidance_scale && { guidance_scale: seedanceInput.guidance_scale }),
            ...(seedanceInput.width && { width: seedanceInput.width }),
            ...(seedanceInput.height && { height: seedanceInput.height }),
          };
          break;

        default:
          throw new Error(`不支持的模型类型: ${modelType}`);
      }

      const prediction = await this.replicate.predictions.create({
        version,
        input: predictionInput,
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
        model_type: modelType,
      };
    } catch (error) {
      console.error("Replicate API调用失败:", error);
      throw new Error(`视频生成任务启动失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 启动 WAN Video 任务
   */
  async startWanVideoGeneration(input: WanVideoInput): Promise<ReplicateVideoResponse> {
    return this.startVideoGeneration(ModelType.WAN_VIDEO, input);
  }

  /**
   * 启动 Seedance Lite 任务
   */
  async startSeedanceLiteGeneration(input: SeedanceInput): Promise<ReplicateVideoResponse> {
    return this.startVideoGeneration(ModelType.SEEDANCE_LITE, input);
  }

  /**
   * 启动 Seedance 任务
   */
  async startSeedanceGeneration(input: SeedanceInput): Promise<ReplicateVideoResponse> {
    return this.startVideoGeneration(ModelType.SEEDANCE, input);
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

  /**
   * 获取模型信息
   */
  async getModelInfo(modelType: ModelType): Promise<any> {
    try {
      const [owner, name] = modelType.split('/');
      const model = await this.replicate.models.get(owner, name);
      return model;
    } catch (error) {
      console.error("获取模型信息失败:", error);
      throw new Error(`获取模型信息失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 创建服务实例
export const replicateVideoService = new ReplicateVideoService(
  process.env.REPLICATE_API_TOKEN || ""
); 