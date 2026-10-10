# Kopia · Reste en cours (15 s, 9:16)

Made with the `saas-motion-video` kit (7 gated stages) + `motion-design` QA, built in HyperFrames.

- Delivery file: `renders/kopia-reste-en-cours-1080x1920.mp4` (H.264, TV-range BT.709, keyframe every 1 s, AAC, -14 LUFS)
- Brief: `BRIEF.md` · Storyboard, ledger and the seven questions: `STORYBOARD.md` · Theme stills: `theme-stills/`
- Theme: 099 Overhead Desk · New component: margin tabs · Motif: the yellow K tag

## Rebuild

Voice-over (French, Kokoro `ff_siwis`): « Le cours commence… et votre chapitre n'est pas encore imprimé ? » ·
« Restez en cours. » · « Une boutique partenaire imprime. Un coursier vérifié vous l'apporte en salle. » ·
« Livré à votre place ! » · « Vos impressions viennent à vous. Kopia point online ! » (edit `LINES` in
`audio/make_voiceover.py`; replace `audio/vo/*.wav` with a recorded voice actor and re-run `make_audio.py`).

```bash
# voice-over (needs kokoro-onnx + the kokoro-v1.0 model files, see scripts/make_voiceover.py)
python3 films/kopia-reste-en-cours/audio/make_voiceover.py --models path/to/kokoro
# audio (voice + music + SFX, ducking, -14 LUFS mix); needs numpy, scipy, soundfile
python3 films/kopia-reste-en-cours/audio/make_audio.py

cd films/kopia-reste-en-cours
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
npx hyperframes browser ensure            # once per machine
npx hyperframes check
npx hyperframes render --quality delivery --resolution portrait-4k --output renders/master-2160x3840.mp4
ffmpeg -y -i renders/master-2160x3840.mp4 -i audio/mix.wav -map 0:v -map 1:a \
  -vf "scale=1080:1920:flags=lanczos:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -g 30 -keyint_min 30 -sc_threshold 0 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest renders/kopia-reste-en-cours-1080x1920.mp4
```

Everything (pictures, music, effects, fonts) is original or OFL-licensed; no third-party footage or photos.
The phone screens are simplified illustrations of the order flow; the price card is labelled "Exemple".
