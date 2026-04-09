# Mahjong Hand Analyzer — 2026 Edition

Mobile-first PWA for American Mahjong hand analysis.

## Deploy on Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import repo
3. Framework: **Other**
4. Root directory: leave as `/`
5. Click Deploy

That's it. Vercel will serve `public/index.html` at your URL.

## Add to Home Screen

### iPhone / Safari
1. Open the app URL in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down → **Add to Home Screen**
4. Tap **Add**

### Android / Chrome
1. Open the app URL in Chrome
2. Tap the **⋮** menu (top right)
3. Tap **Add to Home Screen**
4. Tap **Add**

Once installed it runs in standalone mode — no browser chrome, full screen.

## File Structure

```
mahj-pwa/
├── public/
│   ├── index.html      ← Full app (HTML + CSS + JS, single file)
│   ├── manifest.json   ← PWA manifest
│   ├── icon.svg        ← App icon (SVG)
│   ├── icon-192.png    ← App icon 192px
│   └── icon-512.png    ← App icon 512px
├── vercel.json         ← Vercel routing config
└── README.md
```

## Scoring Model

Difficulty based strictly on Mahjong mechanics:
- Tiles missing
- Whether group can be called from a discard
- Whether jokers can be used

Jokers remain flexible — not assigned to any specific group.
No tile-type bias (winds/dragons/numbers treated identically by structure).
