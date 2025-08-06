我来帮你全面检查项目中关于定价和积分的逻辑。让我先查看相关的代码文件。

Search files...
Ran tool
Read file: services/credit.ts
Read file: services/order.ts
Ran tool
Read file: app/api/generate-video/route.ts
Ran tool
Read file: app/api/generate/route.ts
Ran tool
Read file: app/api/process-queue/route.ts
Ran tool
Read file: components/blocks/pricing-i18n/index.tsx
Read file: app/api/checkout/route.ts
Ran tool
Read file: models/credit.ts
Ran tool
Ran tool
Read file: i18n/messages/en.json
Read file: i18n/messages/en.json
Ran tool
Read file: cankao.md/VIDEO_TASK_PROCESSING_ARCHITECTURE.md
Ran tool
Read file: app/api/webhook/replicate/route.ts
现在让我检查一下视频生成时是否有积分扣除逻辑：

Ran tool
Ran tool
Read file: services/credit.ts
现在让我检查一下是否有定时任务相关的代码：

Ran tool
Read file: public/后续需要做的.md
基于我对项目代码的全面分析，我发现了以下关于定价和积分逻辑的问题：

## �� 项目定价和积分逻辑问题分析

### 1. **用户购买套餐后积分生成问题** ✅ **已实现**
- **状态**: 正常
- **位置**: `services/order.ts` 和 `services/credit.ts`
- **逻辑**: 用户支付成功后，`handleOrderSession` 函数会调用 `updateCreditForOrder` 立即生成积分
- **代码**: 
```36:38:services/order.ts
if (order.credits > 0) {
  // increase credits for paied order
  await updateCreditForOrder(order);
```

### 2. **视频生成时积分扣除问题** ❌ **严重缺失**
- **状态**: 未实现
- **问题**: 视频生成API (`/api/generate-video`) 完全没有积分检查和扣除逻辑
- **影响**: 用户可以无限生成视频而不消耗积分
- **需要修复**: 在视频生成前添加积分检查和扣除

### 3. **积分用完后的限制问题** ❌ **部分缺失**
- **图片生成**: ✅ 已实现积分检查 (`/api/generate`)
- **视频生成**: ❌ 完全没有积分检查
- **代码对比**:
```47:52:app/api/generate/route.ts
const userCredits = await getUserCredits(user_uuid);
if (userCredits.left_credits < CreditsAmount.GenerateCost) {
  return NextResponse.json(
    { success: false, error: "Insufficient credits" },
    { status: 402 }
  );
}
```

### 4. **定时任务积分刷新问题** ❌ **未实现**
- **状态**: 完全缺失
- **问题**: 没有定时任务来清理过期积分
- **影响**: 过期的积分记录会一直存在数据库中
- **需要实现**: 定时清理过期积分的任务

### 5. **定价金额问题** ⚠️ **存在不一致**
- **前端显示**: 月付 $29.9, $39.9, $89.9；年付 $286.8, $180, $468
- **后端配置**: 月付 $9.9, $19.9, $29.9；年付 $94.8, $190.8, $286.8
- **问题**: 前后端定价不匹配
- **位置**: 
  - 前端: `components/blocks/pricing-i18n/index.tsx`
  - 后端: `i18n/messages/en.json`

### 6. **视频生成积分消耗未定义** ❌ **缺失**
- **图片生成**: 消耗1积分 (`CreditsAmount.GenerateCost = 1`)
- **视频生成**: 没有定义消耗积分数量
- **需要添加**: 在 `CreditsAmount` 中定义视频生成消耗的积分

### 7. **积分过期处理逻辑问题** ⚠️ **部分问题**
- **查询逻辑**: ✅ 正确，只查询未过期的积分
- **扣除逻辑**: ⚠️ 有问题，没有按过期时间优先扣除
- **代码问题**:
```75:85:services/credit.ts
for (let i = 0, l = userCredits.length; i < l; i++) {
  const credit = userCredits[i];
  left_credits += credit.credits;

  // credit enough for cost
  if (left_credits >= credits) {
    order_no = credit.order_no;
    expired_at = credit.expired_at || "";
    break;
  }
  // look for next credit
}
```

## ��️ 需要修复的问题优先级

### 高优先级 (立即修复)
1. **添加视频生成积分扣除逻辑**
2. **修复前后端定价不一致问题**
3. **定义视频生成消耗积分数量**

### 中优先级 (近期修复)
4. **实现定时任务清理过期积分**
5. **优化积分扣除逻辑（按过期时间优先）**

### 低优先级 (后续优化)
6. **添加积分使用统计和监控**
7. **优化积分查询性能**

这些问题中，**视频生成没有积分扣除**是最严重的问题，因为用户可以不限次数地生成视频而不消耗任何积分，这会导致严重的成本问题。