-- 完整的数据库模板脚本（适用于新项目）
-- 直接复制到Supabase SQL编辑器执行即可

-- 删除已存在的表（注意：这会删除所有数据）
DROP TABLE IF EXISTS public.video_tasks CASCADE;
DROP TABLE IF EXISTS public.feedbacks CASCADE;
DROP TABLE IF EXISTS public.affiliates CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.credits CASCADE;
DROP TABLE IF EXISTS public.apikeys CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 删除已存在的索引
DROP INDEX IF EXISTS idx_video_tasks_user_uuid;
DROP INDEX IF EXISTS idx_video_tasks_status;
DROP INDEX IF EXISTS idx_video_tasks_replicate_task_id;
DROP INDEX IF EXISTS idx_video_tasks_created_at;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_uuid;
DROP INDEX IF EXISTS idx_users_invite_code;
DROP INDEX IF EXISTS idx_orders_user_uuid;
DROP INDEX IF EXISTS idx_orders_order_no;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_credits_user_uuid;
DROP INDEX IF EXISTS idx_credits_trans_no;
DROP INDEX IF EXISTS idx_credits_trans_type;
DROP INDEX IF EXISTS idx_credits_created_at;
DROP INDEX IF EXISTS idx_apikeys_user_uuid;
DROP INDEX IF EXISTS idx_apikeys_api_key;
DROP INDEX IF EXISTS idx_apikeys_status;
DROP INDEX IF EXISTS idx_feedbacks_user_uuid;
DROP INDEX IF EXISTS idx_feedbacks_created_at;

-- 删除已存在的触发器
DROP TRIGGER IF EXISTS update_video_tasks_updated_at ON public.video_tasks;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

-- 删除已存在的函数
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 重新创建所有表
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at timestamptz DEFAULT now(),
    nickname VARCHAR(255),
    avatar_url VARCHAR(255),
    locale VARCHAR(50),
    signin_type VARCHAR(50),
    signin_ip VARCHAR(255),
    signin_provider VARCHAR(50),
    signin_openid VARCHAR(255),
    invite_code VARCHAR(255) NOT NULL DEFAULT '',
    updated_at timestamptz DEFAULT now(),
    invited_by VARCHAR(255) NOT NULL DEFAULT '',
    is_affiliate BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now(),
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

CREATE TABLE public.apikeys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(100),
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz DEFAULT now(),
    status VARCHAR(50)
);

CREATE TABLE public.credits (
    id SERIAL PRIMARY KEY,
    trans_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now(),
    user_uuid VARCHAR(255) NOT NULL,
    trans_type VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    order_no VARCHAR(255),
    expired_at timestamptz
);

CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    content TEXT,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    status VARCHAR(50),
    cover_url VARCHAR(255),
    author_name VARCHAR(255),
    author_avatar_url VARCHAR(255),
    locale VARCHAR(50)
);

CREATE TABLE public.affiliates (
    id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz DEFAULT now(),
    status VARCHAR(50) NOT NULL DEFAULT '',
    invited_by VARCHAR(255) NOT NULL,
    paid_order_no VARCHAR(255) NOT NULL DEFAULT '',
    paid_amount INT NOT NULL DEFAULT 0,
    reward_percent INT NOT NULL DEFAULT 0,
    reward_amount INT NOT NULL DEFAULT 0
);

CREATE TABLE public.feedbacks (
    id SERIAL PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    status VARCHAR(50),
    user_uuid VARCHAR(255),
    content TEXT,
    rating INT
);

CREATE TABLE public.video_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uuid character varying NOT NULL,
    status character varying CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled')) DEFAULT 'pending',
    input_image_url text,
    output_video_url text,
    prompt text,
    replicate_task_id character varying,
    error_message text,
    priority integer DEFAULT 0,
    retry_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_video_tasks_user_uuid ON public.video_tasks(user_uuid);
CREATE INDEX idx_video_tasks_status ON public.video_tasks(status);
CREATE INDEX idx_video_tasks_replicate_task_id ON public.video_tasks(replicate_task_id);
CREATE INDEX idx_video_tasks_created_at ON public.video_tasks(created_at);
CREATE INDEX idx_video_tasks_priority ON public.video_tasks(priority);
CREATE INDEX idx_video_tasks_status_priority ON public.video_tasks(status, priority DESC);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_uuid ON public.users(uuid);
CREATE INDEX idx_users_invite_code ON public.users(invite_code);

CREATE INDEX idx_orders_user_uuid ON public.orders(user_uuid);
CREATE INDEX idx_orders_order_no ON public.orders(order_no);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

CREATE INDEX idx_credits_user_uuid ON public.credits(user_uuid);
CREATE INDEX idx_credits_trans_no ON public.credits(trans_no);
CREATE INDEX idx_credits_trans_type ON public.credits(trans_type);
CREATE INDEX idx_credits_created_at ON public.credits(created_at);

CREATE INDEX idx_apikeys_user_uuid ON public.apikeys(user_uuid);
CREATE INDEX idx_apikeys_api_key ON public.apikeys(api_key);
CREATE INDEX idx_apikeys_status ON public.apikeys(status);

CREATE INDEX idx_feedbacks_user_uuid ON public.feedbacks(user_uuid);
CREATE INDEX idx_feedbacks_created_at ON public.feedbacks(created_at);

-- 创建自动更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_video_tasks_updated_at 
    BEFORE UPDATE ON public.video_tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON public.posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 启用Row Level Security
ALTER TABLE public.video_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apikeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Users can view their own video tasks" ON public.video_tasks
    FOR SELECT USING (auth.uid()::text = user_uuid);
CREATE POLICY "Users can insert their own video tasks" ON public.video_tasks
    FOR INSERT WITH CHECK (auth.uid()::text = user_uuid);
CREATE POLICY "Users can update their own video tasks" ON public.video_tasks
    FOR UPDATE USING (auth.uid()::text = user_uuid);

CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = uuid);
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = uuid);
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = uuid);

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid()::text = user_uuid);
CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_uuid);

CREATE POLICY "Users can view their own credits" ON public.credits
    FOR SELECT USING (auth.uid()::text = user_uuid);
CREATE POLICY "Users can insert their own credits" ON public.credits
    FOR INSERT WITH CHECK (auth.uid()::text = user_uuid);

CREATE POLICY "Users can view their own apikeys" ON public.apikeys
    FOR SELECT USING (auth.uid()::text = user_uuid);
CREATE POLICY "Users can insert their own apikeys" ON public.apikeys
    FOR INSERT WITH CHECK (auth.uid()::text = user_uuid);
CREATE POLICY "Users can update their own apikeys" ON public.apikeys
    FOR UPDATE USING (auth.uid()::text = user_uuid);
CREATE POLICY "Users can delete their own apikeys" ON public.apikeys
    FOR DELETE USING (auth.uid()::text = user_uuid);

CREATE POLICY "Users can view their own feedbacks" ON public.feedbacks
    FOR SELECT USING (auth.uid()::text = user_uuid);
CREATE POLICY "Users can insert their own feedbacks" ON public.feedbacks
    FOR INSERT WITH CHECK (auth.uid()::text = user_uuid);

CREATE POLICY "Anyone can view posts" ON public.posts
    FOR SELECT USING (true);

-- 管理员策略
CREATE POLICY "Admins can view all video tasks" ON public.video_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE uuid = auth.uid()::text 
            AND is_affiliate = true
        )
    );
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE uuid = auth.uid()::text 
            AND is_affiliate = true
        )
    );
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE uuid = auth.uid()::text 
            AND is_affiliate = true
        )
    );

-- 添加数据验证约束
ALTER TABLE public.users ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.orders ADD CONSTRAINT check_amount_positive 
    CHECK (amount > 0);

ALTER TABLE public.credits ADD CONSTRAINT check_credits_positive 
    CHECK (credits > 0);

ALTER TABLE public.feedbacks ADD CONSTRAINT check_rating_range 
    CHECK (rating >= 1 AND rating <= 5); 