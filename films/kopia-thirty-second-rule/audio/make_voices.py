"""Spoken lines for "The Thirty-Second Rule" with Kokoro TTS (offline, Apache-2.0 model).

Setup: pip install kokoro-onnx soundfile
Models: kokoro-v1.0.onnx + voices-v1.0.bin from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

  python3 audio/make_voices.py --models <folder with the two model files> [--lang en|fr]

Writes audio/vo/<id>.wav (French: audio/vo-fr/) (24 kHz mono, trimmed) and lines.json: for each line its start time in
the film, its length, and a mouth envelope (one value per 1/30 s) that drives the characters' mouths.
"""
import argparse, json, os
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))

# id, film start (s), voice, speed, text. A voice is a Kokoro voice name or a blend {name: weight}.
LINES = {"en": [
    ("mbarga1", 1.20, "bm_george", 1.08, "Good ideas. And I could barely read them."),
    ("mbarga2", 4.25, "bm_george", 1.10, "An investor gives you thirty seconds."),
    ("maman1", 29.10, "af_heart", 0.95, "This is my stall?"),
    ("maman2", 32.00, "af_heart", 0.95, "Your first investor."),
    ("endvo", 34.20, "af_bella", 1.08, "Kopia. Your hard work, perfectly presented."),
], "fr": [
    # Kokoro has one French voice (ff_siwis, female). Dr. Mbarga is a male blend that keeps 20 % of it, which brings the
    # French pronunciation closer to ff_siwis (MFCC/DTW check) while the pitch stays male (~146 Hz).
    ("mbarga1", 1.20, {"am_fenrir": 0.6, "am_onyx": 0.2, "ff_siwis": 0.2}, 0.9, "De bonnes idées… mais presque illisibles."),
    ("mbarga2", 4.25, {"am_fenrir": 0.6, "am_onyx": 0.2, "ff_siwis": 0.2}, 1.02, "Un investisseur vous accorde trente secondes."),
    ("maman1", 29.10, "ff_siwis", 1.0, "C'est mon commerce ?"),
    ("maman2", 31.90, "ff_siwis", 1.0, "Ta première investisseuse."),
    ("endvo", 34.20, "pf_dora", 1.05, "Kopia. Votre travail, parfaitement présenté."),
]}
FPS = 30


def trim(a, sr, thresh=0.008, pad=0.03):
    idx = np.where(np.abs(a) > thresh)[0]
    if not len(idx):
        return a
    s = max(0, idx[0] - int(pad * sr)); e = min(len(a), idx[-1] + int(pad * sr))
    return a[s:e]


def envelope(a, sr):
    hop = sr // FPS
    n = int(np.ceil(len(a) / hop))
    rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    peak = np.percentile(rms, 95) or 1.0
    env = np.clip(rms / peak, 0, 1)
    env = np.where(env < 0.12, 0, env)  # closed mouth in the gaps
    return [round(float(v), 3) for v in env]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True)
    ap.add_argument("--lang", default="en", choices=sorted(LINES))
    args = ap.parse_args()
    outdir = os.path.join(HERE, "vo" if args.lang == "en" else "vo-" + args.lang)
    k = Kokoro(os.path.join(args.models, "kokoro-v1.0.onnx"), os.path.join(args.models, "voices-v1.0.bin"))
    out = []
    os.makedirs(outdir, exist_ok=True)
    for lid, start, voice, speed, text in LINES[args.lang]:
        if args.lang == "fr":
            lang = "fr-fr"
        else:
            lang = "en-gb" if voice.startswith("b") else "en-us"
        style = voice if isinstance(voice, str) else sum(w * k.get_voice_style(v) for v, w in voice.items())
        a, sr = k.create(text, voice=style, speed=speed, lang=lang)
        a = trim(np.asarray(a, dtype=np.float32), sr)
        sf.write(os.path.join(outdir, f"{lid}.wav"), a, sr)
        dur = len(a) / sr
        vname = voice if isinstance(voice, str) else "+".join(f"{v}:{w}" for v, w in voice.items())
        out.append({"id": lid, "start": start, "dur": round(dur, 3), "end": round(start + dur, 3),
                    "voice": vname, "text": text, "env": envelope(a, sr)})
        print(f"{lid:8s} {vname:34s} {start:6.2f} → {start + dur:6.2f}  ({dur:.2f} s)  {text}")
    json.dump(out, open(os.path.join(outdir, "lines.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
