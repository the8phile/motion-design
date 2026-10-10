# Kopia · The Thirty-Second Rule (37 s, 9:16)

The commercial script in `stories/the-thirty-second-rule.md`, made as an animated cut-paper film.
Made with the `saas-motion-video` kit (run end to end at the user's request, recommended option at each gate) +
`motion-design` QA, built in HyperFrames.

- Delivery file: `renders/kopia-thirty-second-rule-1080x1920.mp4` (H.264 High@4.0, TV-range BT.709, keyframe every 1 s, AAC, -14.5 LUFS, 26 MiB)
- Brief: `BRIEF.md` · Facts on screen: `facts.md` · Storyboard, ledger and the seven questions: `STORYBOARD.md`
- Theme: 087 Cut-Paper Title Sequence (adapted) · New component: the print-seam · Motif: the second copy

## How it is built

- `src/` holds the parts of `index.html`: `00-head.html` (page, styles, clips, captions, supers), `10-lib.js`
  (cut-paper helpers, character rigs, the KOPIA lockup), `20-scenes.js` (one SVG per shot), `30-timeline.js`
  (the GSAP timeline and a per-frame driver for paper boil, lip sync, blinks and small loops).
  Edit the parts, then `sh src/build.sh` writes `index.html`.
- Handmade paper (Nadège's pages, the lecturer's stack) "boils": a seeded displacement that changes 12 times a
  second. Everything Kopia prints is drawn with straight edges and never moves. That contrast is the film's idea.
- The logo is rebuilt from `brand/kopia-logo-on-blue.jpg` (tile 331 px, radius ~74, red copy offset 26 px, Poppins
  Bold); a pixel diff against the brand image leaves only 1 px anti-aliasing edges. Swap in the official SVG when
  it is available.
- Mouths follow the voice: `audio/make_voices.py` writes a loudness envelope per line (`assets/lines.js`).

## Rebuild

```bash
pip install kokoro-onnx soundfile scipy numpy
python3 audio/make_voices.py --models <folder with kokoro-v1.0.onnx + voices-v1.0.bin>   # voices + mouth envelopes
python3 audio/make_audio.py                                                            # music + SFX + mix, -14 LUFS
sh src/build.sh                                                                        # index.html from src/

export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
npx hyperframes browser ensure            # once per machine
# 1080×1920 master, 4 workers (a 4K master is better on a machine with a GPU: in this cloud container it ran at
# ~12 s per frame on one worker, so the delivered film was rendered at 1080×1920)
npx hyperframes@0.8.144 render --quality delivery --resolution portrait --workers 4 --output renders/master-1080x1920.mp4
ffmpeg -y -i renders/master-1080x1920.mp4 -i audio/mix.wav -map 0:v -map 1:a \
  -vf "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -c:v libx264 -preset slow -crf 21 -profile:v high -level:v 4.0 -refs 3 -bf 2 -maxrate 7M -bufsize 14M -g 30 -keyint_min 30 -sc_threshold 0 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -af "volume=-0.5dB" -c:a aac -b:a 160k -ar 48000 -ac 2 -movflags +faststart -shortest renders/kopia-thirty-second-rule-1080x1920.mp4
# High@4.0 with 3 reference frames plays smoothly on phones and stays under 30 MiB (26 MiB) for messaging apps.
# Do not add -tune animation: it raises refs to 10 and the level to 5.0, and phones then skip during playback.
```

## Rights and honesty

- Pictures, music and sound effects are original (coded); fonts are OFL (Poppins, Caveat, Inter, in `assets/fonts`).
- Voices: Kokoro-82M (Apache-2.0), voices `bm_george`, `af_heart`, `af_bella`. They are synthetic, with American and
  British accents, not Cameroonian.
- The kopia.online screen is a simplified illustration (labelled on screen). No prices, times or partner
  institutions are shown. Every claim is listed in `facts.md`.
