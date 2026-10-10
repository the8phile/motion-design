"""Spoken lines for "The Thirty-Second Rule" with Kokoro TTS (offline, Apache-2.0 model).

Setup: pip install kokoro-onnx soundfile
Models: kokoro-v1.0.onnx + voices-v1.0.bin from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

  python3 audio/make_voices.py --models <folder with the two model files>

Writes audio/vo/<id>.wav (24 kHz mono, trimmed) and audio/vo/lines.json: for each line its start time in
the film, its length, and a mouth envelope (one value per 1/30 s) that drives the characters' mouths.
"""
import argparse, json, os
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))

# id, film start (s), voice, speed, text
LINES = [
    ("mbarga1", 1.20, "bm_george", 1.08, "Good ideas. And I could barely read them."),
    ("mbarga2", 4.25, "bm_george", 1.10, "An investor gives you thirty seconds."),
    ("maman1", 29.10, "af_heart", 0.95, "This is my stall?"),
    ("maman2", 32.00, "af_heart", 0.95, "Your first investor."),
    ("endvo", 34.20, "af_bella", 1.08, "Kopia. Your hard work, perfectly presented."),
]
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
    args = ap.parse_args()
    k = Kokoro(os.path.join(args.models, "kokoro-v1.0.onnx"), os.path.join(args.models, "voices-v1.0.bin"))
    out = []
    os.makedirs(os.path.join(HERE, "vo"), exist_ok=True)
    for lid, start, voice, speed, text in LINES:
        lang = "en-gb" if voice.startswith("b") else "en-us"
        a, sr = k.create(text, voice=voice, speed=speed, lang=lang)
        a = trim(np.asarray(a, dtype=np.float32), sr)
        sf.write(os.path.join(HERE, "vo", f"{lid}.wav"), a, sr)
        dur = len(a) / sr
        out.append({"id": lid, "start": start, "dur": round(dur, 3), "end": round(start + dur, 3),
                    "voice": voice, "text": text, "env": envelope(a, sr)})
        print(f"{lid:8s} {voice:10s} {start:6.2f} → {start + dur:6.2f}  ({dur:.2f} s)  {text}")
    json.dump(out, open(os.path.join(HERE, "vo", "lines.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
