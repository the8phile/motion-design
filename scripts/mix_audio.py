"""Mix music, voice-over and sound effects into public/audio/mix.wav.

  python3 scripts/mix_audio.py

Run after make_music.py / make_sfx.py / make_voiceover.py. The music ducks
under each voice-over line (timing from src/voiceover.json), then a
look-ahead limiter keeps peaks under -1.5 dBFS.
"""
import json
import os

import numpy as np
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d, minimum_filter1d, uniform_filter1d
from scipy.signal import resample_poly

SR = 44100
FPS = 30
MUSIC_VOLUME = 0.78
DUCKED_VOLUME = 0.3
DUCK_RAMP = 6 / FPS  # seconds
SFX_VOLUME = 0.42
VO_VOLUME = 1.0
CEILING = 10 ** (-1.5 / 20)
OUTPUT_GAIN = 10 ** (-2.4 / 20)  # trims the master to about -14 LUFS, the level social apps expect
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, "public", "audio")


def load(path):
    sr, data = wavfile.read(path)
    data = data.astype(np.float64) / (32768.0 if data.dtype == np.int16 else 1.0)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    if sr != SR:
        g = np.gcd(SR, sr)
        data = resample_poly(data, SR // g, sr // g, axis=0)
    return data


music = load(os.path.join(AUDIO, "music.wav"))
sfx = load(os.path.join(AUDIO, "sfx.wav"))
n = max(len(music), len(sfx))
mix = np.zeros((n, 2))

lines = json.load(open(os.path.join(ROOT, "src", "voiceover.json"), encoding="utf-8"))
t = np.arange(n) / SR
duck = np.zeros(n)
for line in lines:
    start = line["from"] / FPS
    end = start + line["durationInFrames"] / FPS
    shape = np.interp(t, [start - DUCK_RAMP, start, end, end + DUCK_RAMP], [0, 1, 1, 0], left=0, right=0)
    duck = np.maximum(duck, shape)
    vo = load(os.path.join(ROOT, "public", line["file"]))
    i = int(start * SR)
    j = min(n, i + len(vo))
    mix[i:j] += vo[: j - i] * VO_VOLUME

music_gain = MUSIC_VOLUME + (DUCKED_VOLUME - MUSIC_VOLUME) * duck
mix[: len(music)] += music * music_gain[: len(music), None]
mix[: len(sfx)] += sfx * SFX_VOLUME

# Look-ahead peak limiter (5 ms attack window, 80 ms smoothing).
peak = maximum_filter1d(np.max(np.abs(mix), axis=1), size=int(0.005 * SR))
gain = np.minimum(1.0, CEILING / np.maximum(peak, 1e-9))
gain = minimum_filter1d(gain, size=int(0.01 * SR))
gain = uniform_filter1d(gain, size=int(0.01 * SR))
gain = np.minimum(gain, minimum_filter1d(gain, size=int(0.08 * SR), origin=0))
mix *= gain[:, None]
mix = np.clip(mix, -CEILING, CEILING) * OUTPUT_GAIN

out = os.path.join(AUDIO, "mix.wav")
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"wrote {out} ({n / SR:.1f}s), max gain reduction {20 * np.log10(gain.min()):.1f} dB")
