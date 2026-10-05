# Kopia — motion design ad

A 37-second vertical (1080×1920, 9:16) video ad for **Kopia**, campus printing and delivery
in Cameroon. Built with [Remotion](https://www.remotion.dev/) (React → MP4).
Made for WhatsApp Status, TikTok, Instagram/Facebook Reels and Stories.

Rendered file: [`out/kopia-ad-9x16.mp4`](out/kopia-ad-9x16.mp4)

## Storyboard (French)

| Time | Scene | On screen |
|---|---|---|
| 0:00–0:03 | Hook | Real lecture-hall photo, "Encore la queue à l'imprimerie ?", clock sticker |
| 0:03–0:06 | Logo reveal | Yellow wipe, K logo, "Imprimez vos documents. On les livre jusqu'en salle." |
| 0:06–0:09 | Campus | Two campus photos, "Autour de votre campus", pins "Boutique partenaire" / "Livré jusqu'en salle" |
| 0:09–0:16 | Steps 1–2 | Realistic 3D phone (titanium frame, Dynamic Island, WhatsApp-style chat): zone → PDF (24 pages) → quote 680 XAF → pay with MTN MoMo / Orange Money |
| 0:14–0:17 | Escrow | Coin drops into a lock: the money stays with Kopia until handover |
| 0:17–0:22 | Steps 3–4 | Printer counts 24/24 pages, scooter travels from the shop to "Salle B12" |
| 0:22–0:26 | Step 5 | Phone: "courier arrived" notification, PIN 4821 in the chat, "Livré !", 680 XAF split: shop 480 / courier 150 / Kopia 50 |
| 0:26–0:29 | Focus | Poster-style: "Concentrez-vous sur vos cours." + yellow band "Kopia s'occupe de l'impression." over a classroom photo |
| 0:29–0:35 | Call to action | Phone opens kopia.online (address typed, page loads, button tapped), "Dès 25 XAF" sticker, "Commandez sur kopia.online", referral offer |

## Usage

```bash
npm install
npm run studio   # live preview and editing in the browser
npm run render   # writes out/kopia-ad-9x16.mp4
```

## Editing

- Text lives in `src/scenes/*.tsx`; colours and the font in `src/theme.ts`.
- Scene order and lengths (in frames, 30 fps) are in `SCENES` in `src/KopiaAd.tsx`.

## Sound

Both tracks are generated offline, so there is nothing to license from a third party.

- **Voice-over** (French, female voice): `public/audio/vo/*.wav`, timed by `src/voiceover.json`.
  Edit the lines in `scripts/make_voiceover.py` and re-run it:
  ```bash
  pip install -r scripts/requirements.txt
  # download kokoro-v1.0.onnx + voices-v1.0.bin from
  # https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
  python3 scripts/make_voiceover.py --models path/to/that/folder
  ```
- **Music**: an original 108 BPM Afro-pop loop (kick, clap, tresillo rim, shaker, log drum, marimba chords,
  kalimba lead) synthesised by `scripts/make_music.py` into `public/audio/music.wav`. The beat drops on
  the logo reveal and ends on a hit during the call to action.
- **Sound effects**: 76 synthesised cues (word pops, ticking clock, whooshes, message sounds,
  payment chime, coin and lock, printer and paper, scooter engine, notification, PIN taps,
  keyboard typing, button tap) placed on frames in `scripts/make_sfx.py` → `public/audio/sfx.wav`.
- **Mix**: `scripts/mix_audio.py` combines everything into `public/audio/mix.wav`, which is the only
  audio file the video uses. The music ducks under each voice-over line, a limiter catches the
  peaks, and the master sits at about −14 LUFS, the level social platforms expect. Levels are the
  constants at the top of that script.

Sound-effect cues are relative to scene starts (table `S` in `scripts/make_sfx.py`); keep it in sync
with `SCENES` in `src/KopiaAd.tsx`. After changing music, effects or voice: `npm run audio` (re-runs music, effects and the mix), then
`npm run render`.

To use a real voice actor or a licensed track instead, replace the WAV files (same names) and
run `python3 scripts/mix_audio.py` and re-render. If a recorded line runs longer, adjust its `from` / `durationInFrames` in `src/voiceover.json`.

### Photos

`public/photos/*.jpg` are classroom and campus photos supplied for the draft (upscaled from small originals).
**Before running the ad, replace them with photos you own or have licensed, and get consent from
recognisable people. `campus-2.jpg` shows an institution's name on its sign: check with them
before implying a partnership.** Keep the same file names, ideally at 1500 px wide or more, and re-render.

### Credits
- Voice: [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (Apache-2.0), voice `ff_siwis`,
  trained on the [SIWIS French speech corpus](https://datashare.is.ed.ac.uk/handle/10283/2353) (CC BY 4.0).

Fonts: Poppins and Inter (SIL Open Font License), bundled in `public/fonts`.
The phone is drawn in code (`src/components/Phone.tsx`), so it stays sharp at any resolution;
its angle is animated with `rotateX` / `rotateY` / `rotateZ` in `src/scenes/Chat.tsx`.
