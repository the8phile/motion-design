# Kopia · Reste en cours — version complète (40 s, 9:16)

The full ad, extended from the 15 s film `films/kopia-reste-en-cours`. Process: `saas-motion-video` stages + gates,
`motion-design` QA, built in HyperFrames, official Kopia brand (`brand/`).

| Time | Moment | Voice (French, Kokoro ff_siwis) |
|---|---|---|
| 0–2 s | the question in the notebook | « Le cours commence… et votre chapitre n'est pas encore imprimé ? » |
| 2–4 s | order, pay with MTN MoMo / Orange Money | |
| 4–5.5 s | drop: the whole lecture hall | « Restez en cours. » |
| 5.5–9.5 s | money sealed in a Kopia envelope, "libéré au code PIN" | « Payez par MTN MoMo ou Orange Money : votre argent reste chez Kopia. » |
| 9.5–15.5 s | margin tabs, the courier sets the pack down | « Une boutique partenaire imprime. Un coursier vérifié vous l'apporte en salle. » « Livré à votre place. » |
| 15.5–19.5 s | PIN lights the seal, it breaks, slips 480 / 150 / 50 XAF | « Donnez votre code PIN : alors seulement, le paiement est libéré. » |
| 19.5–24 s | price stamps (music stops) | « Dès vingt-cinq francs la page, et deux cents francs la livraison en salle. » |
| 24–28 s | handwritten notes → typed Word sheet, 300 XAF/page | « Vos notes manuscrites ? Une boutique les tape pour vous. » |
| 28–31 s | supplies: notebook + pens | « Stylos, cahiers : même paiement, même livraison. » |
| 31–35 s | referral note passed to the next desk | « Parrainez un ami : cent francs pour vous, cinquante de réduction pour lui. » |
| 35–40 s | blue end card | « Vos impressions viennent à vous. Kopia point online ! » |

## Rebuild

```bash
python3 films/kopia-reste-en-cours-complet/audio/make_voiceover.py --models path/to/kokoro   # voice lines
python3 films/kopia-reste-en-cours-complet/audio/make_audio.py                              # music + SFX + voice mix, -14 LUFS
cd films/kopia-reste-en-cours-complet
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
npx hyperframes browser ensure && npx hyperframes check
npx hyperframes render --quality delivery --resolution portrait-4k --output renders/master-2160x3840.mp4   # ~10 min
ffmpeg -y -i renders/master-2160x3840.mp4 -i audio/mix.wav -map 0:v -map 1:a \
  -vf "scale=1080:1920:flags=lanczos:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -g 30 -keyint_min 30 -sc_threshold 0 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest renders/kopia-reste-en-cours-complet-1080x1920.mp4
```

Phone screens and the payment split are illustrations of the real flow; the order card is labelled "Exemple".
