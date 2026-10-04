"""Generate the French voice-over with Kokoro TTS (offline, Apache-2.0 model).

Setup:
  pip install kokoro-onnx soundfile
  Download kokoro-v1.0.onnx and voices-v1.0.bin from
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
  and pass their folder with --models.

Writes public/audio/vo/NN.wav and src/voiceover.json (start frame + length of
each line). Edit LINES below and re-run to change the script or timing.
"""
import argparse
import json
import os

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

FPS = 30
VIDEO_FRAMES = 942
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (start frame, on-screen text, spoken text). Spoken text is spelled for
# French TTS pronunciation ("code pine" for PIN, "Momo" for MoMo).
LINES = [
    (8, "Encore la queue à l'imprimerie… et le cours qui commence ?",
     "Encore la queue à l'imprimerie… et le cours qui commence ?"),
    (100, "Avec Kopia, on imprime… et on livre jusqu'en salle !",
     "Avec Kopia, on imprime… et on livre jusqu'en salle !"),
    (186, "Envoyez votre fichier depuis votre téléphone.",
     "Envoyez votre fichier depuis votre téléphone."),
    (305, "Payez par MoMo ou Orange Money.",
     "Payez par Momo, ou Orange Money."),
    (416, "Votre argent reste bloqué jusqu'à la livraison.",
     "Votre argent reste bloqué, jusqu'à la livraison."),
    (518, "Une boutique partenaire imprime…",
     "Une boutique partenaire imprime…"),
    (596, "…et un coursier vérifié vous l'apporte en salle.",
     "et un coursier vérifié vous l'apporte en salle."),
    (672, "Donnez votre code PIN. C'est livré !",
     "Donnez votre code pine. C'est livré !"),
    (782, "Kopia ! Dès 25 francs la page. Commandez sur kopia.online",
     "Kopia ! Dès vingt-cinq francs la page. Commandez sur kopia point online !"),
]

# Phoneme fixes applied after espeak phonemization.
PHONEME_FIXES = {"ɔ̃lˈajn": "ɔnlˈajn"}  # "online" without the nasal "on"

VOICE = "ff_siwis"
BASE_SPEED = 1.08
MAX_SPEED = 1.35


def trim(audio: np.ndarray, sr: int, thresh=0.01) -> np.ndarray:
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    pad = int(0.03 * sr)
    return audio[max(0, idx[0] - pad): idx[-1] + pad]


def level(audio: np.ndarray, target_rms_db=-15.0) -> np.ndarray:
    """Bring every line to the same loudness, soft-limiting the peaks."""
    rms = np.sqrt(np.mean(audio ** 2))
    audio = audio * (10 ** (target_rms_db / 20) / max(rms, 1e-6))
    return np.tanh(audio * 1.1) / np.tanh(1.1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True, help="folder with kokoro-v1.0.onnx and voices-v1.0.bin")
    args = ap.parse_args()
    kokoro = Kokoro(os.path.join(args.models, "kokoro-v1.0.onnx"),
                    os.path.join(args.models, "voices-v1.0.bin"))

    out_dir = os.path.join(ROOT, "public", "audio", "vo")
    os.makedirs(out_dir, exist_ok=True)
    meta = []
    for i, (start, caption, spoken) in enumerate(LINES):
        end = LINES[i + 1][0] - 4 if i + 1 < len(LINES) else VIDEO_FRAMES - 6
        slot = (end - start) / FPS
        phonemes = kokoro.tokenizer.phonemize(spoken, lang="fr-fr")
        for bad, good in PHONEME_FIXES.items():
            phonemes = phonemes.replace(bad, good)
        speed = BASE_SPEED
        while True:
            audio, sr = kokoro.create(phonemes, voice=VOICE, speed=speed, is_phonemes=True)
            audio = trim(audio, sr)
            dur = len(audio) / sr
            if dur <= slot or speed >= MAX_SPEED:
                break
            speed = min(MAX_SPEED, speed * dur / slot + 0.02)
        audio = level(audio)
        name = f"{i + 1:02d}.wav"
        sf.write(os.path.join(out_dir, name), audio, sr)
        frames = int(np.ceil(dur * FPS))
        flag = "" if dur <= slot else "  !! longer than its slot"
        print(f"{name} start={start} dur={dur:.2f}s slot={slot:.2f}s speed={speed:.2f}{flag}")
        meta.append({"file": f"audio/vo/{name}", "from": start, "durationInFrames": frames, "text": caption})

    with open(os.path.join(ROOT, "src", "voiceover.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
