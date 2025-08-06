// Seedance 1.0 Lite 使用示例

// 1. 纯文本生成视频 (T2V)
async function generateVideoFromText() {
  const response = await fetch('/api/generate-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelType: 'seedance-lite',
      prompt: 'a woman walks in the park',
      // 可选参数
      num_frames: 150, // 5秒视频 (30fps)
      num_inference_steps: 20,
      guidance_scale: 7.5,
      width: 480,
      height: 720,
      webhook: 'https://your-domain.com/api/webhook/replicate'
    })
  });

  const result = await response.json();
  console.log('任务创建成功:', result.data);
  
  // 返回任务ID，用于后续查询状态
  return result.data.id;
}

// 2. 图片生成视频 (I2V)
async function generateVideoFromImage(imageUrl: string) {
  const response = await fetch('/api/generate-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelType: 'seedance-lite',
      prompt: 'make the image come alive with gentle movement',
      image: imageUrl, // 图片URL
      num_frames: 150,
      webhook: 'https://your-domain.com/api/webhook/replicate'
    })
  });

  const result = await response.json();
  return result.data.id;
}

// 3. 查询任务状态
async function checkTaskStatus(taskId: string) {
  const response = await fetch(`/api/generate-video?taskId=${taskId}`);
  const result = await response.json();
  
  console.log('任务状态:', result.data);
  
  if (result.data.status === 'succeeded') {
    console.log('视频生成完成:', result.data.output);
    return result.data.output; // 视频URL
  } else if (result.data.status === 'failed') {
    console.error('任务失败:', result.data.error);
    return null;
  } else {
    console.log('任务处理中...');
    return null;
  }
}

// 4. 轮询任务状态
async function pollTaskStatus(taskId: string, maxAttempts: number = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const videoUrl = await checkTaskStatus(taskId);
    
    if (videoUrl) {
      console.log('🎉 视频生成完成!', videoUrl);
      return videoUrl;
    }
    
    if (i < maxAttempts - 1) {
      console.log(`⏳ 等待中... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒后重试
    }
  }
  
  console.error('⏰ 任务超时');
  return null;
}

// 5. 完整使用流程
async function generateVideoComplete() {
  try {
    // 启动视频生成
    const taskId = await generateVideoFromText();
    console.log('任务ID:', taskId);
    
    // 轮询状态直到完成
    const videoUrl = await pollTaskStatus(taskId);
    
    if (videoUrl) {
      // 下载视频
      const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();
      
      // 保存到本地
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-video.mp4';
      a.click();
      
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('视频生成失败:', error);
  }
}

// 导出函数供其他模块使用
export {
  generateVideoFromText,
  generateVideoFromImage,
  checkTaskStatus,
  pollTaskStatus,
  generateVideoComplete
}; 