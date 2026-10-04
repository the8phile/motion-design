"""Synthesize an original, royalty-free Afro-pop backing track for the ad.

  pip install numpy scipy
  python3 scripts/make_music.py   # writes public/audio/music.wav

108 BPM, F major (F - Dm - Bb - C). Intro is filtered until the beat drops on
the logo reveal (frame 97), the kalimba lead enters for the delivery scenes,
and the track ends with a hit on the call to action.
"""
import os

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
LENGTH = 1039 / 30  # video length in seconds
BPM = 108
STEP = 60 / BPM / 4  # one 16th note
BAR = STEP * 16
DROP = 97 / 30  # beat drops on the logo reveal
END_BAR = 13  # final hit, bars after the drop
LEAD_FROM = 17.0
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

rng = np.random.default_rng(7)
N = int(SR * LENGTH)
tracks = {name: np.zeros(N) for name in ["kick", "clap", "perc", "shaker", "bass", "keys", "lead", "fx"]}


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(track, start, sig, gain=1.0):
    i = int(start * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    end = min(N, i + len(sig))
    tracks[track][i:end] += gain * sig[: end - i]


def env(dur, decay, attack=0.002):
    t = np.arange(int(dur * SR)) / SR
    return t, np.minimum(1, t / attack) * np.exp(-t * decay)


def filt(sig, kind, freq, order=2):
    sos = butter(order, freq, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, sig)


def kick():
    t, e = env(0.45, 8)
    f = 48 + 110 * np.exp(-t * 35)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * e
    click = filt(rng.standard_normal(len(t)), "highpass", 2000) * np.exp(-t * 300) * 0.3
    return np.tanh(1.6 * (body + click))


def clap():
    t, e = env(0.3, 18)
    noise = filt(rng.standard_normal(len(t)), "bandpass", [900, 3500])
    bursts = sum(np.exp(-np.maximum(0, t - d) * 120) * (t >= d) for d in (0, 0.012, 0.024))
    return noise * (0.5 * bursts + e) * 0.6


def perc(freq=780):
    t, e = env(0.12, 45)
    return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.7 * t)) * e * 0.5


def shaker(accent):
    t, e = env(0.08, 60, attack=0.008)
    return filt(rng.standard_normal(len(t)), "highpass", 6000) * e * (0.35 if accent else 0.18)


def log_drum(note):
    t, e = env(0.42, 7)
    f = midi(note) * (1 + 0.6 * np.exp(-t * 40))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return np.tanh(2.2 * s) * e * 0.55  # saturation so it reads on phone speakers


def marimba(note, dur=0.6, decay=7):
    t, e = env(dur, decay, attack=0.003)
    f = midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 25)
    return s * e


def kalimba(note):
    t, e = env(0.9, 5, attack=0.002)
    f = midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 30)
    return s * e * 0.5


# F major I - vi - IV - V
CHORDS = [[65, 69, 72], [62, 65, 69], [58, 62, 65], [60, 64, 67]]
BASS = [41, 38, 46, 36]
KICK = [0, 7, 8, 11]
CLAP = [4, 12]
PERC = [3, 6, 10, 14]  # tresillo-flavoured rim pattern
STABS = [2, 5, 8, 10, 13]
BASS_STEPS = [(0, 0), (3, 0), (6, 12), (10, 0), (11, 7)]  # (step, interval)
LEAD = [  # (step in a 2-bar phrase, MIDI note), F pentatonic
    (0, 77), (3, 79), (6, 81), (8, 79), (10, 77), (14, 74),
    (16, 72), (19, 74), (22, 77), (24, 79), (27, 77), (30, 74),
]

first_bar = -int(np.ceil(DROP / BAR))
for bar in range(first_bar, END_BAR):
    t0 = DROP + bar * BAR
    chord, root = CHORDS[bar % 4], BASS[bar % 4]
    main = bar >= 0
    last_intro_bar = bar == -1
    for step in range(16):
        ts = t0 + step * STEP
        swing = 0.12 * STEP if step % 2 else 0  # light swing on the off-16ths
        place("shaker", ts + swing, shaker(step % 4 == 2))
        if step in STABS:
            for n in chord:
                place("keys", ts, marimba(n), 0.22)
        if not main:
            if last_intro_bar and step in (8, 10, 12, 13, 14, 15):
                place("perc", ts, perc(600 + step * 40), 0.8)  # build-up roll
            continue
        if step in KICK:
            place("kick", ts, kick())
        if step in CLAP:
            place("clap", ts, clap())
        if step in PERC:
            place("perc", ts + swing, perc())
        for s, interval in BASS_STEPS:
            if s == step:
                place("bass", ts, log_drum(root + interval))
    if main and t0 >= LEAD_FROM - BAR:
        phrase = bar % 2
        for s, n in LEAD:
            if s // 16 == phrase:
                ts = t0 + (s % 16) * STEP
                if ts >= LEAD_FROM:
                    place("lead", ts, kalimba(n))

# Final hit: kick + full chord + bass, left to ring out.
hit = DROP + END_BAR * BAR
place("kick", hit, kick(), 1.2)
place("bass", hit, log_drum(41), 1.2)
for n in [53, 65, 69, 72, 77]:
    place("keys", hit, marimba(n, dur=LENGTH - hit, decay=1.6), 0.3)

# Riser into the drop: filtered noise + rising tone over the last half bar.
r_len = BAR / 2
t = np.arange(int(r_len * SR)) / SR
ramp = (t / r_len) ** 2
riser = filt(rng.standard_normal(len(t)), "highpass", 3000) * ramp * 0.12
riser += np.sin(2 * np.pi * np.cumsum(300 + 900 * ramp) / SR) * ramp * 0.08
place("fx", DROP - r_len, riser)

# Intro keys are low-passed until the drop.
cut = int(DROP * SR)
tracks["keys"][:cut] = filt(tracks["keys"][:cut], "lowpass", 900, order=4) * 1.3


def reverb(sig, seconds=0.9, mix=0.18):
    t = np.arange(int(seconds * SR)) / SR
    ir = rng.standard_normal(len(t)) * np.exp(-t * 6)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(sig, ir)[: len(sig)]
    return sig + mix * wet


def stereo(sig, pan=0.0, delay_ms=0.0):
    left = sig * np.sqrt(0.5 * (1 - pan))
    right = sig * np.sqrt(0.5 * (1 + pan))
    d = int(delay_ms / 1000 * SR)
    if d:
        right = np.concatenate([np.zeros(d), right[:-d]])
    return np.stack([left, right], axis=1)


mix = (
    stereo(tracks["kick"]) * 0.9
    + stereo(reverb(tracks["clap"], mix=0.25)) * 0.55
    + stereo(tracks["perc"], pan=-0.35) * 0.5
    + stereo(tracks["shaker"], pan=0.4) * 0.6
    + stereo(filt(tracks["bass"], "lowpass", 1800)) * 0.75
    + stereo(reverb(tracks["keys"]), delay_ms=9) * 0.8
    + stereo(reverb(tracks["lead"], mix=0.3), pan=0.2, delay_ms=6) * 0.55
    + stereo(tracks["fx"]) * 0.8
)

# Short fade-in/out, soft clip, normalise to about -1 dBFS.
fade = int(0.6 * SR)
mix[:200] *= np.linspace(0, 1, 200)[:, None]
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix = np.tanh(1.3 * mix / np.max(np.abs(mix)))
mix *= 0.89 / np.max(np.abs(mix))

out = os.path.join(ROOT, "public", "audio", "music.wav")
os.makedirs(os.path.dirname(out), exist_ok=True)
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print(f"wrote {out} ({LENGTH:.1f}s)")
