# Grok Imagine

Grok Imagine AI Video Generation Platform - Turn wild ideas into viral content.

![preview](preview.png)

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/grok-imagine/grok-imagine.git
```

2. Install dependencies

```bash
pnpm install
```

3. Run the development server

```bash
pnpm dev
```

## Customize

- Set your environment variables

```bash
cp .env.example .env.local
```

- Set your theme in `app/theme.css`

[shadcn-ui-theme-generator](https://zippystarter.com/tools/shadcn-ui-theme-generator)

- Set your landing page content in `i18n/pages/landing`

- Set your i18n messages in `i18n/messages`

## Deploy

- Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgrok-imagine%2Fgrok-imagine&project-name=grok-imagine&repository-name=grok-imagine&redirect-url=https%3A%2F%2Fwww.grok-imagine.pro&demo-title=Grok%20Imagine&demo-description=Grok%20Imagine%20AI%20Video%20Generation%20Platform&demo-url=https%3A%2F%2Fwww.grok-imagine.pro&demo-image=preview.png)

- Deploy to Cloudflare

1. Customize your environment variables

```bash
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml
```

edit your environment variables in `.env.production`

and put all the environment variables under `[vars]` in `wrangler.toml`

2. Deploy

```bash
npm run cf:deploy
```

## Community

- [Grok Imagine](https://www.grok-imagine.pro)
- [Documentation](https://www.grok-imagine.pro/docs)
- [Discord](https://discord.gg/your-invite-link)

## License

- [Grok Imagine AI SaaS Boilerplate License Agreement](LICENSE)
# Trigger redeploy 2025年 8月 6日 星期三 13时22分43秒 CST
