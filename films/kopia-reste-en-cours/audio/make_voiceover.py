"""French voice-over for 'Kopia · Reste en cours' with Kokoro TTS (offline, Apache-2.0, voice ff_siwis).

  pip install kokoro-onnx soundfile
  python3 films/kopia-reste-en-cours/audio/make_voiceover.py --models <folder with kokoro-v1.0.onnx + voices-v1.0.bin>

Writes audio/vo/NN.wav and audio/vo.json (start + length of each line). make_audio.py mixes them in
and ducks the music under each line. Each line is sped up only if it would overrun its slot.
"""
import argparse
import json
import os

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
LENGTH = 15.0

# (start s, spoken text). Slots end 0.1 s before the next line (last one at 14.9 s).
LINES = [
    (0.15, "Le cours commence… et votre chapitre n'est pas encore imprimé ?"),  # the question
    (4.05, "Restez en cours."),                                                   # the drop over the hall
    (5.6, "Une boutique partenaire imprime. Un coursier vérifié vous l'apporte en salle."),  # margin tabs
    (10.0, "Livré à votre place !"),                                              # the pack lands
    (11.85, "Vos impressions viennent à vous. Kopia point online !"),             # CTA
]
PHONEME_FIXES = {"ɔ̃lˈajn": "ɔnlˈajn"}  # "online" without a nasal "on"
VOICE, BASE_SPEED, MAX_SPEED = "ff_siwis", 1.05, 1.3


def trim(a, sr, th=0.01):
    idx = np.where(np.abs(a) > th)[0]
    pad = int(0.03 * sr)
    return a[max(0, idx[0] - pad): idx[-1] + pad] if len(idx) else a


def level(a, target_db=-15.0):
    rms = np.sqrt(np.mean(a ** 2))
    a = a * (10 ** (target_db / 20) / max(rms, 1e-6))
    return np.tanh(a * 1.1) / np.tanh(1.1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True)
    a = ap.parse_args()
    k = Kokoro(os.path.join(a.models, "kokoro-v1.0.onnx"), os.path.join(a.models, "voices-v1.0.bin"))
    out = os.path.join(HERE, "vo")
    os.makedirs(out, exist_ok=True)
    meta = []
    for i, (start, text) in enumerate(LINES):
        end = LINES[i + 1][0] - 0.1 if i + 1 < len(LINES) else LENGTH - 0.1
        slot = end - start
        ph = k.tokenizer.phonemize(text, lang="fr-fr")
        for bad, good in PHONEME_FIXES.items():
            ph = ph.replace(bad, good)
        speed = BASE_SPEED
        while True:
            audio, sr = k.create(ph, voice=VOICE, speed=speed, is_phonemes=True)
            audio = trim(audio, sr)
            dur = len(audio) / sr
            if dur <= slot or speed >= MAX_SPEED:
                break
            speed = min(MAX_SPEED, speed * dur / slot + 0.02)
        name = f"{i + 1:02d}.wav"
        sf.write(os.path.join(out, name), level(audio), sr)
        flag = "" if dur <= slot else "  !! overruns its slot"
        print(f"{name} {start:5.2f}s dur={dur:.2f}s slot={slot:.2f}s speed={speed:.2f}{flag}  {text}")
        meta.append({"file": f"vo/{name}", "start": start, "duration": round(dur, 3), "text": text})
    json.dump(meta, open(os.path.join(HERE, "vo.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
