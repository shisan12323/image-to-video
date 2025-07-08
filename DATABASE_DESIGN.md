# AI Garden Design - 数据库设计文档

## 项目概述
AI Garden Design 是一个基于AI的花园设计SaaS平台，用户可以通过AI生成个性化的花园设计方案。

## 数据库架构决策

### 架构选择：扩展现有架构
- **保留现有表结构**：用户管理、订单系统、积分系统、API管理等
- **增量添加**：园艺设计相关的核心表
- **向后兼容**：确保现有代码不受影响

### 技术栈
- **数据库**: PostgreSQL (Supabase)
- **认证**: NextAuth.js + Supabase Auth
- **ORM**: Supabase JavaScript Client
- **支付**: Stripe

## 数据库表结构

### 1. 现有核心表（保持不变）

#### 1.1 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at timestamptz,
    nickname VARCHAR(255),
    avatar_url VARCHAR(255),
    locale VARCHAR(50),
    signin_type VARCHAR(50),
    signin_ip VARCHAR(255),
    signin_provider VARCHAR(50),
    signin_openid VARCHAR(255),
    invite_code VARCHAR(255) NOT NULL default '',
    updated_at timestamptz,
    invited_by VARCHAR(255) NOT NULL default '',
    is_affiliate BOOLEAN NOT NULL default false,
    UNIQUE (email, signin_provider)
);
```

#### 1.2 订单表 (orders)
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL DEFAULT '',
    user_email VARCHAR(255) NOT NULL DEFAULT '',
    amount INT NOT NULL,
    interval VARCHAR(50),
    expired_at timestamptz,
    status VARCHAR(50) NOT NULL,
    stripe_session_id VARCHAR(255),
    credits INT NOT NULL,
    currency VARCHAR(50),
    sub_id VARCHAR(255),
    sub_interval_count int,
    sub_cycle_anchor int,
    sub_period_end int,
    sub_period_start int,
    sub_times int,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    valid_months int,
    order_detail TEXT,
    paid_at timestamptz,
    paid_email VARCHAR(255),
    paid_detail TEXT
);
```

#### 1.3 积分表 (credits)
```sql
CREATE TABLE credits (
    id SERIAL PRIMARY KEY,
    trans_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL,
    trans_type VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    order_no VARCHAR(255),
    expired_at timestamptz
);
```

#### 1.4 API密钥表 (apikeys)
```sql
CREATE TABLE apikeys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(100),
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    status VARCHAR(50)
);
```

#### 1.5 联盟营销表 (affiliates)
```sql
CREATE TABLE affiliates (
    id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    status VARCHAR(50) NOT NULL default '',
    invited_by VARCHAR(255) NOT NULL,
    paid_order_no VARCHAR(255) NOT NULL default '',
    paid_amount INT NOT NULL default 0,
    reward_percent INT NOT NULL default 0,
    reward_amount INT NOT NULL default 0
);
```

#### 1.6 反馈表 (feedbacks)
```sql
CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    created_at timestamptz,
    status VARCHAR(50),
    user_uuid VARCHAR(255),
    content TEXT,
    rating INT
);
```

#### 1.7 文章表 (posts)
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    content TEXT,
    created_at timestamptz,
    updated_at timestamptz,
    status VARCHAR(50),
    cover_url VARCHAR(255),
    author_name VARCHAR(255),
    author_avatar_url VARCHAR(255),
    locale VARCHAR(50)
);
```

### 2. 新增园艺设计相关表

#### 2.1 花园设计表 (garden_designs)
```sql
CREATE TABLE garden_designs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    
    -- 用户输入
    input_prompt TEXT NOT NULL,
    garden_size VARCHAR(50), -- 'small', 'medium', 'large'
    garden_style VARCHAR(50), -- 'modern', 'traditional', 'cottage', 'zen', 'tropical'
    budget_range VARCHAR(50), -- 'low', 'medium', 'high'
    maintenance_level VARCHAR(50), -- 'low', 'medium', 'high'
    climate_zone VARCHAR(50),
    soil_type VARCHAR(50),
    sun_exposure VARCHAR(50), -- 'full_sun', 'partial_sun', 'shade'
    
    -- AI处理结果
    ai_prompt TEXT,
    ai_model VARCHAR(50),
    ai_response TEXT,
    
    -- 图片资源
    before_image_url VARCHAR(255),
    after_image_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    
    -- 植物推荐
    recommended_plants JSONB,
    
    -- 状态管理
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    processing_time_ms INT,
    
    -- 积分消耗
    credits_used INT DEFAULT 1,
    
    -- 时间戳
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT garden_designs_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);
```

#### 2.2 植物信息表 (plants)
```sql
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    
    -- 基本信息
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    common_names TEXT[],
    description TEXT,
    
    -- 分类信息
    plant_type VARCHAR(50), -- 'tree', 'shrub', 'flower', 'grass', 'herb', 'vine'
    category VARCHAR(50), -- 'perennial', 'annual', 'biennial'
    
    -- 生长特性
    height_min INT, -- 厘米
    height_max INT, -- 厘米
    width_min INT, -- 厘米
    width_max INT, -- 厘米
    growth_rate VARCHAR(50), -- 'slow', 'medium', 'fast'
    
    -- 环境需求
    sun_requirements VARCHAR(50), -- 'full_sun', 'partial_sun', 'shade'
    water_needs VARCHAR(50), -- 'low', 'medium', 'high'
    soil_type VARCHAR(50), -- 'clay', 'sandy', 'loamy', 'any'
    hardiness_zones INT[],
    
    -- 观赏特性
    flower_color VARCHAR(50),
    flowering_season VARCHAR(50),
    foliage_color VARCHAR(50),
    foliage_type VARCHAR(50), -- 'evergreen', 'deciduous'
    
    -- 护理信息
    maintenance_level VARCHAR(50), -- 'low', 'medium', 'high'
    pruning_needs VARCHAR(50),
    fertilizer_needs VARCHAR(50),
    
    -- 图片
    image_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    
    -- 状态
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
    
    -- 时间戳
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);
```

#### 2.3 用户偏好表 (user_preferences)
```sql
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(255) NOT NULL,
    
    -- 花园偏好
    preferred_styles VARCHAR(50)[],
    preferred_colors VARCHAR(50)[],
    preferred_plants VARCHAR(255)[],
    
    -- 环境信息
    location_country VARCHAR(50),
    location_city VARCHAR(100),
    climate_zone VARCHAR(50),
    typical_soil_type VARCHAR(50),
    
    -- 个人偏好
    maintenance_preference VARCHAR(50), -- 'low', 'medium', 'high'
    budget_preference VARCHAR(50), -- 'low', 'medium', 'high'
    experience_level VARCHAR(50), -- 'beginner', 'intermediate', 'expert'
    
    -- 过敏信息
    plant_allergies TEXT[],
    
    -- 时间戳
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT user_preferences_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES users(uuid),
    CONSTRAINT user_preferences_user_uuid_unique UNIQUE (user_uuid)
);
```

#### 2.4 设计集合表 (design_collections)
```sql
CREATE TABLE design_collections (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    
    -- 集合信息
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- 访问控制
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- 时间戳
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    CONSTRAINT design_collections_user_uuid_fkey FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);
```

#### 2.5 设计集合关联表 (design_collection_items)
```sql
CREATE TABLE design_collection_items (
    id SERIAL PRIMARY KEY,
    collection_uuid VARCHAR(255) NOT NULL,
    design_uuid VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    
    -- 时间戳
    created_at timestamptz NOT NULL DEFAULT now(),
    
    CONSTRAINT design_collection_items_collection_uuid_fkey FOREIGN KEY (collection_uuid) REFERENCES design_collections(uuid),
    CONSTRAINT design_collection_items_design_uuid_fkey FOREIGN KEY (design_uuid) REFERENCES garden_designs(uuid),
    CONSTRAINT design_collection_items_unique UNIQUE (collection_uuid, design_uuid)
);
```

## 数据关系图

```
users (现有)
├── orders (现有)
├── credits (现有)
├── apikeys (现有)
├── affiliates (现有)
├── feedbacks (现有)
├── garden_designs (新增)
├── user_preferences (新增)
└── design_collections (新增)
    └── design_collection_items (新增)
        └── garden_designs (关联)

plants (新增) - 独立表，通过JSONB关联到garden_designs
posts (现有) - 用于博客内容
```

## 业务流程

### 1. 用户注册流程
1. 用户通过NextAuth登录 → 数据存储在Supabase的`auth.users`
2. 首次登录创建用户记录 → `users`表
3. 赠送新用户积分 → `credits`表

### 2. 花园设计流程
1. 用户输入设计需求 → 创建`garden_designs`记录
2. 调用AI服务生成设计 → 更新`garden_designs`记录
3. 扣除用户积分 → 创建`credits`记录
4. 返回设计结果 → 更新`garden_designs`状态

### 3. 积分管理流程
1. 用户购买积分 → `orders`表记录订单
2. 支付成功 → `credits`表增加积分
3. 使用AI服务 → `credits`表扣除积分
4. 查询剩余积分 → 从`credits`表计算

## 索引优化建议

```sql
-- 花园设计表索引
CREATE INDEX idx_garden_designs_user_uuid ON garden_designs(user_uuid);
CREATE INDEX idx_garden_designs_status ON garden_designs(status);
CREATE INDEX idx_garden_designs_created_at ON garden_designs(created_at);

-- 植物表索引
CREATE INDEX idx_plants_plant_type ON plants(plant_type);
CREATE INDEX idx_plants_sun_requirements ON plants(sun_requirements);
CREATE INDEX idx_plants_maintenance_level ON plants(maintenance_level);

-- 用户偏好表索引
CREATE INDEX idx_user_preferences_user_uuid ON user_preferences(user_uuid);
```

## 数据迁移策略

### 阶段1：创建核心表
1. 创建现有表结构（解决登录问题）
2. 创建`garden_designs`表
3. 创建`plants`表（预置数据）

### 阶段2：完善功能
1. 创建`user_preferences`表
2. 创建集合相关表
3. 添加索引优化

### 阶段3：数据预置
1. 导入植物数据库
2. 创建默认设计模板
3. 配置AI模型参数

## 注意事项

1. **现有代码兼容性**: 新表不会影响现有功能
2. **认证系统**: 继续使用NextAuth + Supabase Auth
3. **积分系统**: 保持现有积分逻辑不变
4. **支付系统**: 保持现有Stripe集成不变
5. **API系统**: 现有API Key功能保持不变

## 版本控制

- **v1.0**: 现有基础架构
- **v1.1**: 添加园艺设计核心功能
- **v1.2**: 完善植物数据库和用户偏好
- **v1.3**: 添加设计集合和分享功能

## 部署检查清单

- [ ] 备份现有数据库
- [ ] 在开发环境测试新表结构
- [ ] 验证现有功能不受影响
- [ ] 创建数据迁移脚本
- [ ] 准备回滚方案
- [ ] 更新环境变量配置
- [ ] 测试新功能集成
- [ ] 部署到生产环境
- [ ] 监控系统运行状态

---

**文档版本**: 1.0  
**最后更新**: 2025-01-08  
**维护者**: AI Garden Design Team