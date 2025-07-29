# Image to Video

Image to Video AI SaaS Startups in hours.

![preview](preview.png)

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/image-to-video/image-to-video.git
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimage-to-video%2Fimage-to-video&project-name=image-to-video&repository-name=image-to-video&redirect-url=https%3A%2F%2Fwww.image-to-video.art&demo-title=Image%20to%20Video&demo-description=Image%20to%20Video%20AI%20Startup%20in%20hours%2C%20not%20days&demo-url=https%3A%2F%2Fwww.image-to-video.art&demo-image=preview.png)

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

- [Image to Video](https://www.image-to-video.art)
- [Documentation](https://www.image-to-video.art/docs)
- [Discord](https://discord.gg/your-invite-link)

## License

- [Image to Video AI SaaS Boilerplate License Agreement](LICENSE)
