// 手动修复积分的脚本
// 请在Node.js环境中运行此脚本

console.log(`
请在Supabase数据库中执行以下SQL语句来手动添加积分：

INSERT INTO credits (
  trans_no,
  created_at,
  user_uuid,
  trans_type,
  credits,
  order_no,
  expired_at
) VALUES (
  '71365887301702',  -- 唯一交易号
  NOW(),             -- 当前时间
  '607fb527-4101-4985-bd0d-0cfb9b419ec7',  -- 你的用户UUID
  'order_pay',       -- 订单支付类型
  80,                -- 基础套餐80积分
  (SELECT order_no FROM orders WHERE user_uuid = '607fb527-4101-4985-bd0d-0cfb9b419ec7' AND status = 'paid' LIMIT 1),  -- 自动获取订单号
  NOW() + INTERVAL '1 month'  -- 1个月后过期
);

执行后，用户的积分应该会从2变成82。

如果你想验证结果，可以运行以下查询：

SELECT 
  SUM(credits) as total_credits
FROM credits 
WHERE user_uuid = '607fb527-4101-4985-bd0d-0cfb9b419ec7' 
  AND (expired_at IS NULL OR expired_at > NOW());
`);

// 或者如果你有Supabase客户端，可以使用以下代码：
const sampleCode = `
// 使用Supabase客户端的代码示例
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function addCreditsManually() {
  const { data, error } = await supabase
    .from('credits')
    .insert([
      {
        trans_no: '71365887301702',
        created_at: new Date().toISOString(),
        user_uuid: '607fb527-4101-4985-bd0d-0cfb9b419ec7',
        trans_type: 'order_pay',
        credits: 80,
        order_no: 'YOUR_ORDER_NO', // 请替换为实际订单号
        expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30天后
      }
    ])

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Credits added successfully:', data)
  }
}
`;

console.log("\n代码示例:");
console.log(sampleCode);