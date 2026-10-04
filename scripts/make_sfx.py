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
FRAMES = 1039
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
# (frame, sound, pan -1..1). Scene starts: Hook 0, Reveal 97, Chat 179,
# Escrow 411, Deliver 513, Pin 665, Focus 772, CTA 869.
CUES = []
CUES += [(8 + i * 5, pop(800 + i * 60), 0) for i in range(6)]  # headline words
CUES += [(32, pop(600, 200, 0.12, 0.5), 0.3)]  # clock sticker
CUES += [(36 + i * 6, tick(i % 2 == 0), 0.3) for i in range(10)]  # ticking clock
CUES += [(92, whoosh(0.5, 200, 5000, 0.5), 0), (107, pop(500, 120, 0.2, 0.7), 0), (131, sparkle(), 0)]
CUES += [(176, whoosh(0.55, 150, 2500, 0.45), 0)]  # phone flies in
CUES += [(193, msg_in(), -0.2), (211, msg_out(), 0.2), (227, msg_in(), -0.2), (245, msg_out(), 0.2),
         (271, msg_in(), -0.2), (297, whoosh(0.4, 300, 1800, 0.25), 0), (313, msg_in(), -0.2),
         (347, click(2000, 0.5), 0), (369, success(), 0)]
CUES += [(425, whoosh(0.4, 3000, 600, 0.25), 0), (451, coin(), 0), (464, lock(), 0)]
CUES += [(479 + i * 7, pop(700 + i * 120, 300, 0.08, 0.35), (-1) ** i * 0.3) for i in range(3)]
CUES += [(513, pop(400, 150, 0.15, 0.5), 0), (525, printer(), 0)]
CUES += [(525 + i * 10, paper(), 0.2) for i in range(5)]
CUES += [(590, whoosh(0.4, 300, 3000, 0.35), 0), (595, pop(), -0.5), (601, pop(1000), 0.5),
         (606, scooter(), 0), (655, msg_in(), 0.5)]
CUES += [(663, whoosh(0.5, 150, 2500, 0.4), 0), (675, notification(), 0)]
CUES += [(687 + i * 5, click(2800 - i * 150, 0.4), 0) for i in range(4)]
CUES += [(711, success(), 0)]
CUES += [(770, whoosh(0.5, 200, 4000, 0.4), 0), (802, whoosh(0.35, 800, 6000, 0.3), -0.4),
         (818, whoosh(0.3, 600, 3000, 0.2), -0.3)]
CUES += [(867, whoosh(0.55, 150, 2500, 0.45), 0), (870, pop(500, 150, 0.15, 0.5), 0)]
CUES += [(875 + round(k * 20 / 12), click(3200 + (k % 3) * 300, 0.22), 0.1) for k in range(12)]
CUES += [(911, pop(400, 100, 0.25, 0.7), 0.4), (911, sparkle(), 0.4), (921, pop(700, 200, 0.12, 0.5), 0),
         (943, click(1800, 0.5), 0)]

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
