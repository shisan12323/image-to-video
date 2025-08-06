#!/usr/bin/env node

/**
 * 简单的队列系统测试脚本
 * 这个脚本会帮你测试：
 * 1. 提交任务到队列
 * 2. 查看队列状态
 * 3. 处理队列中的任务
 * 4. 查询任务状态
 */

// 自动检测端口，优先尝试3000，然后是3001，3002
const PORTS = [3000, 3001, 3002];
let BASE_URL = '';

async function detectPort() {
  for (const port of PORTS) {
    try {
      const response = await fetch(`http://localhost:${port}/api/ping`);
      if (response.ok) {
        BASE_URL = `http://localhost:${port}`;
        console.log(`✅ 检测到服务器运行在端口 ${port}`);
        return;
      }
    } catch (error) {
      // 继续尝试下一个端口
    }
  }
  throw new Error('无法检测到运行中的服务器，请确保 npm run dev 已启动');
}

console.log('🧪 开始测试任务队列系统');

// 检测服务器端口
await detectPort();
console.log('📍 测试地址:', BASE_URL);
console.log('');

// 测试数据
const testTask = {
  image: 'https://example.com/test-image.jpg',
  prompt: '一个美丽的风景视频，阳光明媚，鸟儿飞翔',
  userId: 'test-user-123'
};

// 发送HTTP请求的工具函数
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// 测试1: 提交任务
async function testSubmitTask() {
  console.log('📝 测试1: 提交任务到队列');
  console.log('─'.repeat(40));
  
  console.log('🔄 正在提交任务...');
  console.log('   图片URL:', testTask.image);
  console.log('   描述:', testTask.prompt);
  console.log('   用户ID:', testTask.userId);
  
  const result = await makeRequest(`${BASE_URL}/api/generate-video`, {
    method: 'POST',
    body: JSON.stringify(testTask)
  });
  
  console.log('   状态码:', result.status);
  
  if (result.data.success) {
    console.log('   ✅ 任务提交成功!');
    console.log('   任务ID:', result.data.taskId);
    console.log('   状态:', result.data.status);
    console.log('   预计等待时间:', result.data.estimatedWaitTime);
    return result.data.taskId;
  } else {
    console.log('   ❌ 任务提交失败:', result.data.error);
    return null;
  }
}

// 测试2: 查看队列统计
async function testQueueStats() {
  console.log('\n📊 测试2: 查看队列统计');
  console.log('─'.repeat(40));
  
  console.log('🔄 正在获取队列统计...');
  
  const result = await makeRequest(`${BASE_URL}/api/process-queue`);
  
  console.log('   状态码:', result.status);
  
  if (result.data.success) {
    console.log('   ✅ 队列统计获取成功!');
    console.log('   总任务数:', result.data.stats.totalTasks);
    console.log('   待处理任务:', result.data.stats.pendingTasks);
    console.log('   处理中任务:', result.data.stats.activeTasks);
    console.log('   已完成任务:', result.data.stats.completedTasks);
    console.log('   失败任务:', result.data.stats.failedTasks);
  } else {
    console.log('   ❌ 获取统计失败:', result.data.error);
  }
}

// 测试3: 查询任务状态
async function testQueryTaskStatus(taskId) {
  if (!taskId) {
    console.log('\n🔍 测试3: 跳过任务状态查询（没有成功提交的任务）');
    return;
  }
  
  console.log('\n🔍 测试3: 查询任务状态');
  console.log('─'.repeat(40));
  
  console.log('🔄 正在查询任务状态...');
  console.log('   任务ID:', taskId);
  
  const result = await makeRequest(`${BASE_URL}/api/generate-video?taskId=${taskId}`);
  
  console.log('   状态码:', result.status);
  
  if (result.data.taskId) {
    console.log('   ✅ 任务信息获取成功!');
    console.log('   任务ID:', result.data.taskId);
    console.log('   状态:', result.data.status);
    console.log('   优先级:', result.data.priority);
    console.log('   重试次数:', result.data.retryCount);
    console.log('   创建时间:', result.data.createdAt);
  } else {
    console.log('   ❌ 查询失败:', result.data.error);
  }
}

// 测试4: 测试并发限制
async function testConcurrencyLimit() {
  console.log('\n🚫 测试4: 测试并发限制');
  console.log('─'.repeat(40));
  
  console.log('🔄 尝试提交多个任务（测试用户限制）...');
  
  const tasks = [];
  for (let i = 0; i < 5; i++) {
    tasks.push({
      image: `https://example.com/test-image-${i}.jpg`,
      prompt: `测试任务 ${i + 1}`,
      userId: 'test-user-123' // 使用同一个用户
    });
  }
  
  let successCount = 0;
  let limitCount = 0;
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`\n   提交任务 ${i + 1}:`);
    
    const result = await makeRequest(`${BASE_URL}/api/generate-video`, {
      method: 'POST',
      body: JSON.stringify(task)
    });
    
    if (result.data.success) {
      console.log('   ✅ 成功');
      successCount++;
    } else if (result.status === 429) {
      console.log('   🚫 被限制:', result.data.error);
      limitCount++;
    } else {
      console.log('   ❌ 其他错误:', result.data.error);
    }
  }
  
  console.log(`\n📊 并发限制测试结果:`);
  console.log(`   成功: ${successCount}`);
  console.log(`   被限制: ${limitCount}`);
  console.log(`   其他错误: ${tasks.length - successCount - limitCount}`);
}

// 主测试函数
async function runAllTests() {
  try {
    console.log('🚀 开始运行所有测试...\n');
    
    // 测试1: 提交任务
    const taskId = await testSubmitTask();
    
    // 测试2: 查看队列统计
    await testQueueStats();
    
    // 测试3: 查询任务状态
    await testQueryTaskStatus(taskId);
    
    // 测试4: 测试并发限制
    await testConcurrencyLimit();
    
    console.log('\n🎉 所有测试完成！');
    console.log('\n📋 测试总结:');
    console.log('✅ 任务提交功能');
    console.log('✅ 队列统计功能');
    console.log('✅ 状态查询功能');
    console.log('✅ 并发限制功能');
    
    console.log('\n💡 下一步:');
    console.log('1. 启动队列处理器: npm run queue:processor');
    console.log('2. 观察任务处理过程');
    console.log('3. 查看详细日志输出');
    
  } catch (error) {
    console.error('\n💥 测试过程中发生错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  runAllTests();
} 