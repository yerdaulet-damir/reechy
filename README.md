<div align="center">
  <img src="public/icon.svg" alt="Reechy" width="64" />

  # Reechy

  **The open-source Loom. Record → Trim → Share. Done in 60 seconds.**

  No downloads. No CapCut. No watermarks. No subscription.


  [![License](https://img.shields.io/github/license/yerdaulet-damir/reechy?style=flat-square)](LICENSE)
  [![Stars](https://img.shields.io/github/stars/yerdaulet-damir/reechy?style=flat-square&color=yellow)](https://github.com/yerdaulet-damir/reechy/stargazers)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)

  [**🚀 Try Live Demo**](https://reechy.cam) · [**Report Bug**](https://github.com/yerdaulet-damir/reechy/issues) · [**Request Feature**](https://github.com/yerdaulet-damir/reechy/issues)
</div>

---

## The Problem

You need to send a pitch video. So you:

**open Loom → record → download → open CapCut → trim dead air → export → upload → copy link**

That's **8 steps**. It takes **20+ minutes**. And you still get a watermark.

**Reechy collapses that into 3 steps. Record → Trim → Share. Your pitch is live in 60 seconds.**

---

## What You Get

- **🎥 Browser Recording** — Studio-quality webcam + mic recording. No installs. Zero watermarks. Open the tab and hit record.
- **✂️ In-Browser Editor** — Trim bad takes directly in the browser. Drag handles to cut dead air. Done. No CapCut. No exports.
- **📄 Instant Pitch Pages** — Auto-generated shareable page with your video, custom headline, agenda, and Calendly booking link. One click.
- **📝 Floating Teleprompter** — Control your script while you record. Accurate timecodes so you never lose your place mid-take.
- **🎨 Custom Layouts** — PiP (Picture-in-Picture) frames, cinematic filters, layout modes. Look good without trying.
- **⚡ Blazing Fast** — Built on Next.js 16 + Turbopack + React 19. No lag, no loading screens.

---

## Quick Start

```bash
git clone https://github.com/yerdaulet-damir/reechy.git
cd reechy
cp .env.example .env.local  # configure your env vars
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you're recording in under 60 seconds.

---

## Usage

### Record a pitch:

1. Click **New Recording** → select camera + mic
2. Paste your script into the teleprompter — it floats over your camera feed
3. Hit **Record**

### Edit:

1. After recording, click **Edit**
2. Drag the trim handles to cut bad takes and dead air
3. Hit **Save**

### Share:

1. Click **Generate Pitch Page**
2. Add your headline, agenda, and Calendly link
3. Copy the link — send it to anyone

---

## Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Your deployment URL (e.g. `https://reechy.yourdomain.com`) | Yes |
| `CALENDLY_URL` | Default Calendly link embedded in pitch pages | Optional |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID for video storage | Optional |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key | Optional |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key | Optional |
| `R2_BUCKET_NAME` | Cloudflare R2 bucket name | Optional |
| `R2_PUBLIC_DOMAIN` | Cloudflare R2 public domain | Optional |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for link database | Optional |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | Optional |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 + Turbopack |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + tw-animate-css |
| Components | Radix UI + Shadcn UI |
| Icons | Lucide React |
| Video Storage | Cloudflare R2 (optional) |
| Database | Upstash Redis (optional) |

---

## Roadmap

- [ ] Cloud video storage (S3, Cloudflare R2)
- [ ] Pitch page analytics (views, watch time, clicks)
- [ ] Team workspaces
- [ ] Custom domain for pitch pages
- [ ] AI-powered script suggestions
- [ ] Mobile recording support

---

## Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

All contributions welcome — code, docs, bug reports, and feedback.

---

## Self-Hosting

Reechy is MIT licensed. Host it yourself on Vercel, Railway, or any Node.js platform:

```bash
npm run build
npm start
```

---

## License

MIT — use it, fork it, self-host it, build on it. No strings attached.

---

## Star History

<!-- Star History chart will appear here once the repo has stars -->
<a href="https://star-history.com/#yerdaulet-damir/reechy&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=yerdaulet-damir/reechy&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=yerdaulet-damir/reechy&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=yerdaulet-damir/reechy&type=Date" />
  </picture>
</a>
