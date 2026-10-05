"""Synthesize the sound-effects track (royalty-free) for the ad.

  pip install numpy scipy
  python3 scripts/make_sfx.py   # writes public/audio/sfx.wav

Every effect is placed on a video frame in CUES below; if scene timing in
src/KopiaAd.tsx changes, update the frames here and re-run.
"""
import os

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
FPS = 30
FRAMES = 1121
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(11)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def filt(sig, kind, freq, order=2):
    return sosfilt(butter(order, freq, btype=kind, fs=SR, output="sos"), sig)


def sweep_noise(dur, f0, f1, q=1.5):
    """Noise through a band-pass whose centre glides from f0 to f1.

    Coefficients change every block while the filter state carries over,
    so the sweep has no clicks at block edges.
    """
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    block = 256
    zi = None
    for i in range(0, n, block):
        fc = f0 * (f1 / f0) ** (i / n)
        lo, hi = fc / (1 + 1 / q), min(fc * (1 + 1 / q), SR / 2 - 100)
        sos = butter(2, [lo, hi], btype="bandpass", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + block], zi = sosfilt(sos, noise[i:i + block], zi=zi)
    return out


# ---------------------------------------------------------------- sounds
def pop(f0=900, f1=280, dur=0.09, gain=0.5):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 60)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45) * gain


def click(freq=2600, gain=0.35):
    t = t_axis(0.03)
    n = filt(rng.standard_normal(len(t)), "bandpass", [freq * 0.6, freq * 1.6])
    return (n * 0.6 + np.sin(2 * np.pi * freq * t)) * np.exp(-t * 260) * gain


def whoosh(dur=0.45, f0=300, f1=4000, gain=0.45):
    t = t_axis(dur)
    bell = np.sin(np.pi * t / dur) ** 2
    return sweep_noise(dur, f0, f1) * bell * gain


def bell_tone(freqs, dur=0.35, decay=12, gain=0.3, spacing=0.0):
    out = np.zeros(int((dur + spacing * len(freqs)) * SR))
    for i, fr in enumerate(freqs):
        t = t_axis(dur)
        s = (np.sin(2 * np.pi * fr * t) + 0.3 * np.sin(2 * np.pi * fr * 2.01 * t)) * np.exp(-t * decay)
        s *= np.minimum(1, t / 0.003)
        start = int(i * spacing * SR)
        out[start:start + len(s)] += s
    return out * gain


def msg_in():
    return bell_tone([1318.5, 1760.0], dur=0.3, decay=16, gain=0.22, spacing=0.06)


def msg_out():
    return np.concatenate([whoosh(0.1, 800, 3500, 0.25), np.zeros(10)])[: int(0.1 * SR)] + np.pad(
        pop(1200, 500, 0.06, 0.25), (int(0.04 * SR), 0))[: int(0.1 * SR)]


def success():
    return bell_tone([1046.5, 1318.5, 1568.0, 2093.0], dur=0.5, decay=7, gain=0.2, spacing=0.07)


def notification():
    return bell_tone([1568.0, 1318.5, 1975.5], dur=0.3, decay=10, gain=0.22, spacing=0.09)


def coin():
    t = t_axis(0.6)
    partials = [(2793, 1.0), (4170, 0.6), (5320, 0.45), (6650, 0.3), (8100, 0.2)]
    s = sum(a * np.sin(2 * np.pi * f * t) for f, a in partials) * np.exp(-t * 9)
    bounce = np.zeros_like(s)
    d = int(0.09 * SR)
    bounce[d:] = s[: len(s) - d] * 0.35
    return (s + bounce) * 0.12


def lock():
    t = t_axis(0.25)
    thud = np.sin(2 * np.pi * (90 + 120 * np.exp(-t * 50)) * t) * np.exp(-t * 25)
    return thud * 0.55 + np.pad(click(1800, 0.5), (0, len(t) - int(0.03 * SR)))


def tick(high=True):
    return click(3400 if high else 2400, 0.18)


def printer(dur=1.7):
    t = t_axis(dur)
    saw = 2 * ((t * 118) % 1) - 1
    motor = filt(saw, "lowpass", 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t))
    env = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.15)
    return motor * env * 0.16


def paper():
    return whoosh(0.18, 2500, 6000, 0.18)


def scooter(dur=1.7):
    t = t_axis(dur)
    rpm = 38 + 22 * np.sin(np.pi * t / dur)  # revs up mid-way
    phase = np.cumsum(rpm) / SR
    pulses = np.sign(np.sin(2 * np.pi * phase)) * 0.5 + np.sin(4 * np.pi * phase) * 0.5
    engine = filt(pulses, "lowpass", 900) + filt(rng.standard_normal(len(t)), "bandpass", [300, 1200]) * 0.15
    env = np.minimum(1, t / 0.2) * np.minimum(1, (dur - t) / 0.3)
    return engine * env * 0.22


def sparkle():
    return bell_tone([2093.0, 2637.0, 3136.0, 4186.0], dur=0.4, decay=10, gain=0.1, spacing=0.04)


# ---------------------------------------------------------------- cues
# Scene start frames, matching SCENES in src/KopiaAd.tsx. Cue frames below are
# relative to their scene, so changing a scene only means updating this table.
S = dict(hook=0, reveal=97, campus=179, chat=261, escrow=493, deliver=595, pin=747, focus=854, cta=951)

# (frame, sound, pan -1..1)
CUES = []
h, r, c = S["hook"], S["reveal"], S["campus"]
CUES += [(h + 8 + i * 5, pop(800 + i * 60), 0) for i in range(6)]  # headline words
CUES += [(h + 32, pop(600, 200, 0.12, 0.5), 0.3)]  # clock sticker
CUES += [(h + 36 + i * 6, tick(i % 2 == 0), 0.3) for i in range(10)]  # ticking clock
CUES += [(r - 5, whoosh(0.5, 200, 5000, 0.5), 0), (r + 10, pop(500, 120, 0.2, 0.7), 0), (r + 34, sparkle(), 0)]
CUES += [(c - 3, whoosh(0.45, 300, 3000, 0.35), 0), (c + 4, pop(500, 150, 0.15, 0.45), -0.2),
         (c + 20, whoosh(0.3, 600, 3500, 0.3), 0.5), (c + 22, pop(700, 250, 0.1, 0.4), 0.4),
         (c + 32, pop(1000, 400, 0.08, 0.4), -0.3), (c + 42, pop(1100, 450, 0.08, 0.4), 0.3)]
ch = S["chat"]
CUES += [(ch - 3, whoosh(0.55, 150, 2500, 0.45), 0)]  # phone flies in
CUES += [(ch + 14, msg_in(), -0.2), (ch + 32, msg_out(), 0.2), (ch + 48, msg_in(), -0.2), (ch + 66, msg_out(), 0.2),
         (ch + 92, msg_in(), -0.2), (ch + 118, whoosh(0.4, 300, 1800, 0.25), 0), (ch + 134, msg_in(), -0.2),
         (ch + 168, click(2000, 0.5), 0), (ch + 190, success(), 0)]
e = S["escrow"]
CUES += [(e + 14, whoosh(0.4, 3000, 600, 0.25), 0), (e + 40, coin(), 0), (e + 53, lock(), 0)]
CUES += [(e + 68 + i * 7, pop(700 + i * 120, 300, 0.08, 0.35), (-1) ** i * 0.3) for i in range(3)]
d = S["deliver"]
CUES += [(d, pop(400, 150, 0.15, 0.5), 0), (d + 12, printer(), 0)]
CUES += [(d + 12 + i * 10, paper(), 0.2) for i in range(5)]
CUES += [(d + 77, whoosh(0.4, 300, 3000, 0.35), 0), (d + 82, pop(), -0.5), (d + 88, pop(1000), 0.5),
         (d + 93, scooter(), 0), (d + 142, msg_in(), 0.5)]
p = S["pin"]
CUES += [(p - 2, whoosh(0.5, 150, 2500, 0.4), 0), (p + 10, notification(), 0)]
CUES += [(p + 22 + i * 5, click(2800 - i * 150, 0.4), 0) for i in range(4)]
CUES += [(p + 46, success(), 0)]
fo = S["focus"]
CUES += [(fo - 2, whoosh(0.5, 200, 4000, 0.4), 0), (fo + 30, whoosh(0.35, 800, 6000, 0.3), -0.4),
         (fo + 46, whoosh(0.3, 600, 3000, 0.2), -0.3)]
ct = S["cta"]
CUES += [(ct - 2, whoosh(0.55, 150, 2500, 0.45), 0), (ct + 1, pop(500, 150, 0.15, 0.5), 0)]
CUES += [(ct + 6 + round(k * 20 / 12), click(3200 + (k % 3) * 300, 0.22), 0.1) for k in range(12)]
CUES += [(ct + 42, pop(400, 100, 0.25, 0.7), 0.4), (ct + 42, sparkle(), 0.4), (ct + 52, pop(700, 200, 0.12, 0.5), 0),
         (ct + 74, click(1800, 0.5), 0)]

n = int(FRAMES / FPS * SR)
mix = np.zeros((n, 2))
for frame, sound, pan in CUES:
    i = int(frame / FPS * SR)
    end = min(n, i + len(sound))
    seg = sound[: end - i]
    mix[i:end, 0] += seg * np.sqrt(0.5 * (1 - pan))
    mix[i:end, 1] += seg * np.sqrt(0.5 * (1 + pan))

mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix *= 0.8 / max(1e-6, np.max(np.abs(mix)))
out = os.path.join(ROOT, "public", "audio", "sfx.wav")
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"wrote {out}: {len(CUES)} cues")
