"""Music + SFX for 'Kopia · Reste en cours' (15 s, 120 BPM), all synthesised: no samples, no licences.

  python3 films/kopia-reste-en-cours/audio/make_audio.py

Writes audio/music.wav, audio/sfx.wav and audio/mix.wav (with the voice-over from vo.json when present) (48 kHz stereo, -14 LUFS, true peak <= -1.3 dBTP).
Beat grid: 120 BPM, beat = 0.5 s, bar = 2 s, drop on 4.0 s (frame 120) = the lecture-hall reveal.
Key: C major (vi-IV-I-V: Am F C G), the same key as the kit's warm SFX so everything sits together.
SFX use the saas-motion-kit timbres (tools/warm_sfx.py: marimba, woodblock, room).
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, ".claude", "skills", "saas-motion-video", "tools"))
from warm_sfx import SR, marimba, woodblock, room, env  # noqa: E402

LEN = 15.0
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
DROP = 4.0
N = int(SR * LEN)
rng = np.random.default_rng(21)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)


def put(buf, t, sig, gain=1.0):
    i = int(round(t * SR))
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


# ---------------------------------------------------------------- instruments
def kick():
    t = np.arange(int(SR * 0.4)) / SR
    f = 50 + 70 * np.exp(-t * 32)
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9))


def clap():
    t = np.arange(int(SR * 0.25)) / SR
    n = bp(rng.standard_normal(len(t)), 1000, 4000)
    e = sum(np.exp(-np.maximum(0, t - d) * 90) * (t >= d) for d in (0, 0.011, 0.022)) * 0.5 + np.exp(-t * 20)
    return n * e * 0.5


def shaker(acc):
    t = np.arange(int(SR * 0.07)) / SR
    return hp(rng.standard_normal(len(t)), 6500) * np.minimum(1, t / 0.006) * np.exp(-t * 55) * (0.32 if acc else 0.16)


def bass(m, dur):
    t = np.arange(int(SR * dur)) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return np.tanh(1.8 * s) * np.minimum(1, t / 0.01) * np.exp(-t * 2.2) * 0.5


def kalimba(m, dur=0.9):
    t = np.arange(int(SR * dur)) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 28)
    return s * np.minimum(1, t / 0.002) * np.exp(-t * 4.5) * 0.45


def scratch(dur, density=38, seed=0):
    """Pencil on paper: band-passed noise in irregular short strokes."""
    g = np.random.default_rng(seed)
    n = int(SR * dur)
    base = bp(g.standard_normal(n), 2500, 7000)
    t = np.arange(n) / SR
    strokes = np.zeros(n)
    k = 0.0
    while k < dur:
        L = 0.03 + g.random() * 0.06
        a, b = int(k * SR), int(min(dur, k + L) * SR)
        strokes[a:b] = np.sin(np.linspace(0, np.pi, b - a)) * (0.5 + 0.5 * g.random())
        k += L + g.random() / density
    return base * strokes * 0.18 * np.minimum(1, t / 0.02)


def thump():
    t = np.arange(int(SR * 0.3)) / SR
    body = np.sin(2 * np.pi * (80 + 60 * np.exp(-t * 40)) * t) * np.exp(-t * 18)
    rust = bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 25) * 0.25
    return body * 0.7 + rust


def whoosh(dur=0.45, lo=300, hi=2600, gain=0.3):
    n = int(SR * dur)
    x = bp(rng.standard_normal(n), lo, hi)
    return x * np.sin(np.pi * np.arange(n) / n) ** 2 * gain


# ---------------------------------------------------------------- music
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G (low)
ROOTS = [45, 41, 36, 43]
music = np.zeros(N)
drums = np.zeros(N)
nbar = int(np.ceil(LEN / BAR))
for b in range(nbar):
    t0 = b * BAR
    ch, root = CHORDS[b % 4], ROOTS[b % 4]
    pre = t0 < DROP
    for k in range(16):  # 16ths
        ts = t0 + k * BEAT / 4
        if ts >= 14.0:
            break
        # kalimba arpeggio, always (the warm thread)
        if k % 2 == 0:
            arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]
            put(music, ts, kalimba(arp[(k // 2) % 4]), 0.55 if pre else 0.45)
        if pre:
            # urgency: woodblock clock on 8ths, 16ths in the last half bar before the drop
            if (k % 2 == 0) or (ts >= DROP - BAR / 2):
                put(drums, ts, woodblock(1300 if k % 4 == 0 else 1050), 0.10 + 0.08 * (ts / DROP))
            continue
        put(drums, ts, shaker(k % 4 == 2))
        if k % 4 == 0:
            put(drums, ts, kick(), 0.9)
        if k in (4, 12):
            put(drums, ts, clap(), 0.8)
        if k in (2, 6, 10, 14):  # offbeat marimba chord stabs
            for m in ch:
                put(music, ts, marimba(hz(m + 12), 0.35, 0.3), 0.16)
        if k in (0, 6, 10):
            put(music, ts, bass(root, 0.45 if k else 0.7), 0.9)
    if not pre and t0 >= 9.5 - BAR:  # lift when the pack lands: high marimba line
        for k, m in ((0, 76), (3, 79), (6, 81), (10, 79), (12, 84)):
            if t0 + k * BEAT / 4 >= 9.5:
                put(music, t0 + k * BEAT / 4, marimba(hz(m), 0.5, 0.4), 0.18)

# final chord on 14.0 s, ringing out
for m in (48, 60, 64, 67, 72):
    put(music, 14.0, marimba(hz(m), 1.0, 0.25), 0.22)
put(drums, 14.0, kick(), 1.0)
# riser into the drop
r = whoosh(BAR / 2, 400, 5000, 0.12) * np.linspace(0, 1, int(SR * BAR / 2)) ** 2
put(drums, DROP - BAR / 2, r)
# before the drop the bed is low-passed (muffled), it opens on the drop
cut = int(DROP * SR)
music[:cut] = lp(music[:cut], 1400, 4) * 1.2

# ---------------------------------------------------------------- SFX on frames (seconds)
sfx = np.zeros(N)
put(sfx, 0.03, scratch(1.3, seed=1), 1.0)                                 # handwriting
put(sfx, 1.0, woodblock(1500), 0.25)                                      # 09:58 -> 09:59
put(sfx, 1.4, scratch(0.55, 60, seed=2), 1.2)                             # nervous circle
put(sfx, 2.0, whoosh(0.35, 300, 2000, 0.18))                              # phone slides up
put(sfx, 3.48, woodblock(900), 0.6)                                       # thumb tap
put(sfx, 3.53, room(np.concatenate([marimba(hz(76), 0.4), np.zeros(10)]))[: int(SR * 0.5)], 0.25)  # sent
put(sfx, 3.97, thump(), 0.55)                                             # K tag set down
put(sfx, 4.05, whoosh(0.8, 200, 1800, 0.22))                              # camera rises
put(sfx, 4.95, whoosh(0.6, 250, 2200, 0.16))                              # camera returns
put(sfx, 5.5, whoosh(0.4, 600, 3000, 0.12))                               # tag carried to the margin
for t, m in ((6.0, 76), (7.0, 79), (8.0, 84)):                            # margin tabs: E5 G5 C6
    put(sfx, t, room(marimba(hz(m), 0.45, 0.5)), 0.32)
for i, t in enumerate((5.6, 6.4, 7.2, 8.0, 8.8, 9.6, 10.4)):              # notes keep going
    put(sfx, t, scratch(0.6, seed=10 + i), 0.55)
put(sfx, 9.0, whoosh(0.5, 200, 1500, 0.16))                               # courier's hand
put(sfx, 9.5, thump(), 0.9)                                               # the pack lands
n1 = room(np.concatenate([marimba(hz(76), 0.4), np.zeros(int(SR * 0.09))]) + np.pad(marimba(hz(79), 0.5), (int(SR * 0.09), 0))[: int(SR * 0.49)])
put(sfx, 10.0, n1, 0.3)                                                   # notification
put(sfx, 11.35, whoosh(0.6, 250, 4000, 0.22))                             # yellow flood
put(sfx, 11.85, room(marimba(hz(72), 0.4, 0.4)), 0.22)                    # words
put(sfx, 12.4, room(marimba(hz(79), 0.4, 0.5)), 0.22)                     # kopia.online

# ---------------------------------------------------------------- mix
def stereo(x, pan=0.0):
    return np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1)


fade = int(SR * 0.6)
for buf in (music, drums):
    buf[-fade:] *= np.linspace(1, 0, fade)
music_st = stereo(room(music, 0.12)[:N], -0.1) + stereo(drums, 0.1)
sfx_st = stereo(sfx)

# voice-over (make_voiceover.py): music ducks ~9 dB and SFX ~4 dB under every line
vo = np.zeros(N)
duck = np.zeros(N)
vo_meta = os.path.join(HERE, "vo.json")
if os.path.exists(vo_meta):
    import soundfile as _sf
    from scipy.signal import resample_poly
    tt = np.arange(N) / SR
    for line in json.load(open(vo_meta, encoding="utf-8")):
        x, sr = _sf.read(os.path.join(HERE, line["file"]))
        if x.ndim > 1:
            x = x.mean(1)
        if sr != SR:
            g = np.gcd(SR, sr)
            x = resample_poly(x, SR // g, sr // g)
        put(vo, line["start"], x)
        a, b = line["start"], line["start"] + line["duration"]
        duck = np.maximum(duck, np.interp(tt, [a - 0.12, a, b, b + 0.2], [0, 1, 1, 0], left=0, right=0))
music_gain = 10 ** (-9 * duck / 20)
sfx_gain = 10 ** (-4 * duck / 20)
mix = music_st * 0.8 * music_gain[:, None] + sfx_st * 0.9 * sfx_gain[:, None] + stereo(vo) * 1.15


def write(path, x):
    from scipy.io import wavfile
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    wavfile.write(path, SR, (x * 32767).astype(np.int16))


write(os.path.join(HERE, "music.wav"), music_st)
write(os.path.join(HERE, "sfx.wav"), sfx_st)
pre = os.path.join(HERE, "mix_pre.wav")
write(pre, mix)

# two-pass loudnorm to -14 LUFS / -1.3 dBTP (the motion-design delivery standard)
p1 = subprocess.run(["ffmpeg", "-hide_banner", "-i", pre, "-af", "loudnorm=I=-14:TP=-1.3:LRA=11:print_format=json", "-f", "null", "-"],
                    capture_output=True, text=True).stderr
m = json.loads(p1[p1.rindex("{"): p1.rindex("}") + 1])
af = (f"loudnorm=I=-14:TP=-1.3:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af", af, "-ar", str(SR), os.path.join(HERE, "mix.wav")], check=True)
os.remove(pre)
print("wrote music.wav, sfx.wav, mix.wav")
