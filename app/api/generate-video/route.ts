export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { replicateVideoService, ModelType, SeedanceInput, WanVideoInput } from "@/services/replicate-video";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      modelType = "seedance-lite", 
      prompt, 
      image, 
      webhook,
      ...otherParams 
    } = body;

    // 验证必需参数
    if (!prompt) {
      return NextResponse.json(
        { error: "缺少必需参数: prompt" },
        { status: 400 }
      );
    }

    let result;
    
    switch (modelType) {
      case "wan-video":
        if (!image) {
          return NextResponse.json(
            { error: "WAN Video 模型需要 image 参数" },
            { status: 400 }
          );
        }
        const wanInput: WanVideoInput = {
          image,
          prompt,
          webhook,
        };
        result = await replicateVideoService.startWanVideoGeneration(wanInput);
        break;

      case "seedance-lite":
      case "seedance":
        const seedanceInput: SeedanceInput = {
          prompt,
          ...(image && { image }),
          ...(otherParams.num_frames && { num_frames: otherParams.num_frames }),
          ...(otherParams.num_inference_steps && { num_inference_steps: otherParams.num_inference_steps }),
          ...(otherParams.guidance_scale && { guidance_scale: otherParams.guidance_scale }),
          ...(otherParams.width && { width: otherParams.width }),
          ...(otherParams.height && { height: otherParams.height }),
          webhook,
        };
        
        if (modelType === "seedance-lite") {
          result = await replicateVideoService.startSeedanceLiteGeneration(seedanceInput);
        } else {
          result = await replicateVideoService.startSeedanceGeneration(seedanceInput);
        }
        break;

      default:
        return NextResponse.json(
          { error: `不支持的模型类型: ${modelType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("视频生成API错误:", error);
    return NextResponse.json(
      { 
        error: "视频生成失败", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");
    
    if (!taskId) {
      return NextResponse.json(
        { error: "缺少 taskId 参数" },
        { status: 400 }
      );
    }

    const result = await replicateVideoService.getTaskStatus(taskId);
    
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("查询任务状态API错误:", error);
    return NextResponse.json(
      { 
        error: "查询任务状态失败", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 