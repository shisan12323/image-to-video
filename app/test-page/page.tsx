export const runtime = "edge";

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ 部署测试页面</h1>
      <p>如果您能看到这个页面，说明 Cloudflare Pages 部署正常。</p>
      <p>时间: {new Date().toISOString()}</p>
      <p>环境变量测试:</p>
      <ul>
        <li>SUPABASE_URL: {process.env.SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}</li>
        <li>AUTH_SECRET: {process.env.AUTH_SECRET ? '✅ 已配置' : '❌ 未配置'}</li>
        <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? '✅ 已配置' : '❌ 未配置'}</li>
      </ul>
    </div>
  );
} 