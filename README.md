# Kopia — motion design ad

A 30-second vertical (1080×1920, 9:16) video ad for **Kopia**, campus printing and delivery
in Cameroon. Built with [Remotion](https://www.remotion.dev/) (React → MP4).
Made for WhatsApp Status, TikTok, Instagram/Facebook Reels and Stories.

Rendered file: [`out/kopia-ad-9x16.mp4`](out/kopia-ad-9x16.mp4)

## Storyboard (French)

| Time | Scene | On screen |
|---|---|---|
| 0:00–0:03 | Hook | "Encore la queue à l'imprimerie ?" — a queue of students, a spinning clock |
| 0:03–0:06 | Logo reveal | Yellow wipe, K logo, "Imprimez vos documents. On les livre jusqu'en salle." |
| 0:06–0:14 | Steps 1–2 | Phone chat: zone → PDF (24 pages) → quote 680 XAF → pay with MTN MoMo / Orange Money |
| 0:14–0:17 | Escrow | Coin drops into a lock: the money stays with Kopia until handover |
| 0:17–0:22 | Steps 3–4 | Printer counts 24/24 pages, scooter travels from the shop to "Salle B12" |
| 0:22–0:26 | Step 5 | PIN 4821, "Livré !", 680 XAF split: shop 480 / courier 150 / Kopia 50 |
| 0:26–0:30 | Call to action | "Dès 25 XAF la page", "Commandez sur kopia.online", referral offer |

## Usage

```bash
npm install
npm run studio   # live preview and editing in the browser
npm run render   # writes out/kopia-ad-9x16.mp4
```

## Editing

- Text lives in `src/scenes/*.tsx`; colours and the font in `src/theme.ts`.
- Scene order and lengths (in frames, 30 fps) are in `SCENES` in `src/KopiaAd.tsx`.
- The video has no sound. Add a music bed or voice-over with `<Audio src={staticFile('music.mp3')} />`
  in `src/KopiaAd.tsx` after placing the file in `public/`.

Font: Poppins (SIL Open Font License), bundled in `public/fonts`.
