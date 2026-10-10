"""Music + SFX + voices for 'Kopia · The Thirty-Second Rule' (37 s, 120 BPM). All synthesised or generated offline:
no samples, no licences. Voices come from audio/make_voices.py (Kokoro TTS).

  python3 films/kopia-thirty-second-rule/audio/make_audio.py

Writes audio/music.wav, audio/sfx.wav, audio/voice.wav and audio/mix.wav (48 kHz stereo, -14 LUFS, true peak <= -1.3 dBTP).
Beat grid: 120 BPM, beat 0.5 s, bar 2 s. Story of the music:
  0-7    the lecturer: a low clock pulse, muffled pad (E minor)
  7.5    the power cut: silence; 8.0 a lone kalimba carries the night
  11-15  morning, the order: kalimba + shaker, hi-hats from 13.0
  15-17  the shop: one held chord;  17-19.5 the print-seam ticks in 16ths, riser
  20.0   DROP: full groove with a highlife guitar (G - Em - C - D), the printer lands on the beats
  28-31  softens under Maman; 33-34 riser; 34.0 final hit, chord rings under the end line
"""
import json, os, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt, resample_poly
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, ".claude", "skills", "saas-motion-video", "tools"))
from warm_sfx import SR, marimba, woodblock, room  # noqa: E402

LEN = 37.0
BEAT = 0.5
BAR = 2.0
DROP = 20.0
N = int(SR * LEN)
rng = np.random.default_rng(37)


def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype="high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype="band", fs=SR, output="sos"), x)
def tt(d): return np.arange(int(SR * d)) / SR


def put(buf, t, sig, gain=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(sig) <= 0:
        return
    s0 = max(0, -i); i = max(0, i)
    j = min(len(buf), i + len(sig) - s0)
    buf[i:j] += sig[s0:s0 + j - i] * gain


# ------------------------------------------------------------------ instruments
def kick(g=1.0):
    t = tt(0.4); f = 48 + 75 * np.exp(-t * 30)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)) * g

def clap():
    t = tt(0.25); n = bp(rng.standard_normal(len(t)), 1000, 4200)
    e = sum(np.exp(-np.maximum(0, t - d) * 90) * (t >= d) for d in (0, 0.011, 0.023)) * 0.5 + np.exp(-t * 18)
    return n * e * 0.5

def hat(open_=False):
    t = tt(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7500) * np.exp(-t * (14 if open_ else 70)) * 0.22

def shaker(acc):
    t = tt(0.07)
    return hp(rng.standard_normal(len(t)), 6500) * np.minimum(1, t / 0.006) * np.exp(-t * 55) * (0.3 if acc else 0.15)

def bass(m, dur, g=0.5):
    t = tt(dur); f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)
    return np.tanh(1.7 * s) * np.minimum(1, t / 0.008) * np.exp(-t * 2.4) * g

def kalimba(m, dur=1.0):
    t = tt(dur); f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 28)
    return s * np.minimum(1, t / 0.002) * np.exp(-t * 4.2) * 0.45

def pluck(m, dur=0.6, bright=0.5):
    """Karplus-Strong guitar pluck (highlife guitar)."""
    f = hz(m); n = int(SR * dur); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p) * 0.8
    out = np.zeros(n); dec = 0.5 * (0.996 + 0.003 * bright)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = dec * (buf[i % p] + buf[(i + 1) % p])
    return hp(out, 120) * np.minimum(1, np.arange(n) / 30)

def pad(notes, dur, g=0.12):
    t = tt(dur); s = np.zeros(len(t))
    for m in notes:
        f = hz(m)
        s += np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.3 * t)) + 0.3 * np.sin(2 * np.pi * f * 2.002 * t)
    env = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.4)
    return lp(s, 1600) * env * g

def noise(d, lo, hi, g=1.0):
    return bp(rng.standard_normal(int(SR * d)), lo, hi) * g

def whoosh(d=0.4, lo=300, hi=2600, g=0.3, rise=False):
    n = int(SR * d); x = bp(rng.standard_normal(n), lo, hi)
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    if rise: e = (np.arange(n) / n) ** 2
    return x * e * g

def scratch(d, density=38, seed=0, g=0.18):
    gg = np.random.default_rng(seed); n = int(SR * d)
    base = bp(gg.standard_normal(n), 2500, 7000); strokes = np.zeros(n); k = 0.0
    while k < d:
        L = 0.03 + gg.random() * 0.06; a, b = int(k * SR), int(min(d, k + L) * SR)
        strokes[a:b] = np.sin(np.linspace(0, np.pi, max(1, b - a))) * (0.5 + 0.5 * gg.random())
        k += L + gg.random() / density
    return base * strokes * g

def chalk(d, seed=0):
    """Chalk on a board: grittier, lower than a pen, with a squeak at the start."""
    s = scratch(d, 26, seed, 0.22) + noise(d, 900, 3000, 0.05) * np.sin(np.linspace(0, np.pi, int(SR * d)))
    t = tt(0.12); sq = np.sin(2 * np.pi * (2300 + 300 * np.sin(2 * np.pi * 40 * t)) * t) * np.exp(-t * 18) * 0.05
    s[:len(sq)] += sq
    return s

def thump(g=1.0, f0=80):
    t = tt(0.3)
    return (np.sin(2 * np.pi * (f0 + 60 * np.exp(-t * 40)) * t) * np.exp(-t * 18) * 0.7 + bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 25) * 0.25) * g

def slap():
    t = tt(0.45)
    return (bp(rng.standard_normal(len(t)), 600, 5000) * np.exp(-t * 22) * 0.8 + np.sin(2 * np.pi * (60 + 80 * np.exp(-t * 30)) * t) * np.exp(-t * 9)) * 0.9

def click(f=2500, g=0.4):
    t = tt(0.03)
    return (np.sin(2 * np.pi * f * t) + bp(rng.standard_normal(len(t)), 2000, 8000)) * np.exp(-t * 300) * g

def shutter():
    s = np.zeros(int(SR * 0.12)); put(s, 0, click(3200, 0.5)); put(s, 0.055, click(2100, 0.4)); return s

def chirp(f0, f1, d=0.08):
    t = tt(d); f = np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.06

def crinkle(d, g=0.3):
    n = int(SR * d); x = hp(rng.standard_normal(n), 3000)
    am = (rng.random(n // 200 + 1) > 0.6).astype(float).repeat(200)[:n]
    return x * lp(am, 60) * np.sin(np.pi * np.arange(n) / n) * g

def shh_clack():
    s = np.zeros(int(SR * 0.4)); put(s, 0, whoosh(0.28, 1500, 8000, 0.22)); put(s, 0.26, thump(0.45, 110)); put(s, 0.26, click(1800, 0.25)); return s

def chord_hit(notes, g=0.25):
    s = np.zeros(int(SR * 3.2))
    for m in notes: put(s, 0, marimba(hz(m), 2.6, 0.3), g)
    return s


# ------------------------------------------------------------------ music
music = np.zeros(N); drums = np.zeros(N)
EM = [52, 55, 59]  # E minor
PROG = [([55, 59, 62], 43), ([52, 55, 59], 40), ([48, 52, 55], 36), ([50, 54, 57], 38)]  # G Em C D

# 0-7: clock pulse + muffled pad
put(music, 0.0, pad([40, 47, 52, 55], 7.4, 0.10))
for k in range(1, 14):
    t = k * BEAT
    put(drums, t, kick(0.35 if k % 2 else 0.5) * 0.9)
    if t >= 4.0: put(drums, t, woodblock(1300 if k % 2 else 1050), 0.08)
for t in np.arange(6.0, 7.0, 0.25): put(drums, t, woodblock(1400), 0.07)
# 7.0-7.5 lamp on: soft kalimba, then silence at the power cut
put(music, 7.0, kalimba(64, 0.5), 0.5)
# 8.0-11.0: lone kalimba through the night
KAL = [76, 74, 71, 74, 76, 79, 76, 74, 71, 69, 71, 74]
for i, m in enumerate(KAL): put(music, 8.0 + i * 0.25, kalimba(m, 0.9), 0.55)
for i, m in enumerate(KAL[::-1]): put(music, 11.0 + i * 0.25, kalimba(m, 0.9), 0.42)
put(music, 8.0, pad(EM, 3.2, 0.06))
# 11-15 morning + order: pad, shaker, bass pulse in 8ths, hats from 13
put(music, 11.0, pad([48, 52, 55, 59], 4.2, 0.09))
for t in np.arange(11.0, 15.0, 0.25): put(drums, t, shaker(int(t * 4) % 2 == 0))
for t in np.arange(11.0, 15.0, 0.5): put(music, t, bass(40 if t < 13 else 43, 0.4, 0.35))
for t in np.arange(13.0, 15.0, 0.25): put(drums, t, hat(False), 0.8)
# 15-17 the shop: one held chord
put(music, 15.0, chord_hit([55, 59, 62, 67], 0.16)); put(music, 15.0, pad([43, 55, 59, 62], 2.4, 0.11))
# 17-19.5 seam: muted pulse + riser into the drop
for t in np.arange(17.0, 20.0, 0.5): put(drums, t, kick(0.3), 0.8)
r = whoosh(2.5, 400, 6000, 0.13, rise=True); put(drums, 17.5, r)
put(music, 17.0, pad([50, 54, 57, 62], 3.0, 0.1))
# 20-34 the groove
GTR = [0, 2, 1, 2, 0, 2, 1, 2, 3, 2, 1, 2, 0, 1, 2, 1]  # chord-tone index per 16th
for b in range(7):
    t0 = DROP + b * BAR
    ch, root = PROG[b % 4]
    soft = t0 >= 28.0 and t0 < 32.0
    for k in range(16):
        ts = t0 + k * BEAT / 4
        if ts >= 34.0: break
        if not soft:
            put(drums, ts, shaker(k % 4 == 2))
            if k % 4 == 0: put(drums, ts, kick(), 0.9)
            if k in (4, 12): put(drums, ts, clap(), 0.7)
            if k in (2, 10): put(drums, ts, hat(True), 0.5)
        elif k % 2 == 0:
            put(drums, ts, shaker(k % 4 == 0), 0.7)
        # highlife guitar (Karplus-Strong), 16ths with gaps
        if k not in (3, 7, 11, 15):
            tones = ch + [ch[0] + 12]
            put(music, ts, pluck(tones[GTR[k]] + 12, 0.5, 0.6), 0.16 if not soft else 0.1)
        if k in (0, 6, 10) and not soft: put(music, ts, bass(root, 0.45 if k else 0.7), 0.85)
        if k in (0, 8) and soft: put(music, ts, bass(root, 0.9, 0.4), 0.7)
    put(music, t0, pad(ch, BAR + 0.1, 0.07 if not soft else 0.1))
# 33-34 riser, 34.0 final hit
put(drums, 33.0, whoosh(1.0, 500, 7000, 0.16, rise=True))
for t in (33.0, 33.25, 33.5, 33.625, 33.75, 33.875): put(drums, t, kick(0.5), 0.7)
put(drums, 34.0, kick(1.0)); put(drums, 34.0, hat(True), 0.9)
put(music, 34.0, chord_hit([43, 55, 59, 62, 67, 71], 0.22)); put(music, 34.0, pad([43, 55, 59, 62], 3.0, 0.1))
for i, m in enumerate([67, 71, 74, 79]): put(music, 34.46 + i * 0.25, kalimba(m, 1.2), 0.32)

# ------------------------------------------------------------------ SFX (on the picture's events)
sfx = np.zeros(N)
put(sfx, 0.0, noise(7.0, 200, 2500, 0.012))                       # classroom room tone
put(sfx, 0.0, whoosh(0.32, 200, 1600, 0.12, rise=True))           # the stack falling
put(sfx, 0.31, slap(), 0.8)                                        # paper slap on wood
put(sfx, 0.31, thump(0.6, 70))
put(sfx, 3.86, whoosh(0.3, 300, 3000, 0.22))                       # whip to the board
put(sfx, 4.06, chalk(0.72, 1), 1.0); put(sfx, 4.86, chalk(0.4, 2), 1.0); put(sfx, 5.3, chalk(0.42, 3), 1.0)
put(sfx, 5.62, whoosh(0.32, 300, 3000, 0.2))                       # whip to the lens
# night
fan_t = tt(2.0); fan_f = np.where(fan_t < 0.5, 1.0, np.exp(-(fan_t - 0.5) / 0.5))
fan = bp(rng.standard_normal(len(fan_t)), 150, 900) * 0.05 * fan_f + np.sin(2 * np.pi * np.cumsum(55 * (0.6 + 0.4 * fan_f)) / SR) * 0.02 * fan_f
put(sfx, 7.0, fan)
put(sfx, 7.0, scratch(0.48, seed=11), 0.9)
put(sfx, 7.49, click(900, 0.6)); put(sfx, 7.5, noise(0.06, 80, 400, 0.15))    # the power cut
put(sfx, 8.0, click(2800, 0.35))                                   # torch on
put(sfx, 8.1, scratch(0.9, seed=12), 0.8)
put(sfx, 9.0, scratch(1.9, 44, seed=13), 0.9)
for t in (9.26, 9.76, 10.26): put(sfx, t, whoosh(0.24, 800, 5000, 0.12))
put(sfx, 10.8, whoosh(0.5, 400, 3500, 0.1))                        # dawn
for t, a, b in ((11.15, 3200, 4200), (11.3, 3600, 4800), (11.9, 3000, 4100), (12.05, 3400, 4600), (12.6, 3800, 5000)):
    put(sfx, t, chirp(a, b), 1.0); put(sfx, t + 0.09, chirp(b, a), 0.8)
put(sfx, 11.35, whoosh(0.2, 1500, 6000, 0.08))
put(sfx, 13.0, whoosh(0.34, 300, 2500, 0.12))                      # phone up
for t in (13.5, 13.75, 14.0): put(sfx, t, shutter())
put(sfx, 14.5, woodblock(900), 0.4)
put(sfx, 14.53, room(np.concatenate([marimba(hz(79), 0.3), np.zeros(4000)])), 0.22); put(sfx, 14.62, room(marimba(hz(83), 0.4)), 0.22)
put(sfx, 14.78, whoosh(0.46, 400, 3500, 0.18))                     # the order flies to the shop
put(sfx, 15.24, room(marimba(hz(84), 0.5, 0.5)), 0.24); put(sfx, 15.36, room(marimba(hz(91), 0.6, 0.5)), 0.2)   # order chime
put(sfx, 15.0, noise(4.5, 200, 2000, 0.01))                        # shop room tone
put(sfx, 15.86, click(4000, 0.15))
put(sfx, 16.6, whoosh(0.45, 300, 4000, 0.2, rise=True))            # push-through
for k in range(16):
    put(sfx, 17.15 + k * 0.125, woodblock(2200 if k % 4 == 0 else 1800, 0.06), 0.1)   # the print-seam steps
for i in range(30):
    put(sfx, 17.2 + i * 0.066 + rng.random() * 0.02, click(1500 + rng.random() * 800, 0.08))  # typing
put(sfx, 19.2, whoosh(0.3, 500, 3000, 0.14))
put(sfx, 19.62, click(1200, 0.5)); put(sfx, 19.64, woodblock(700), 0.3)       # print button
motor = noise(2.4, 120, 700, 0.05) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * tt(2.4)))
put(sfx, 19.65, motor)
for i in range(4): put(sfx, 20.0 + i * 0.5 - 0.24, shh_clack(), 0.9)   # sheets land on the beat
put(sfx, 22.22, thump(0.8, 120)); put(sfx, 22.72, thump(0.8, 120))  # two knocks
put(sfx, 23.0, crinkle(0.35, 0.25))                                # sleeve
put(sfx, 23.74, whoosh(0.32, 300, 2500, 0.16)); put(sfx, 23.85, whoosh(0.4, 600, 6000, 0.12))
put(sfx, 24.0, noise(2.0, 200, 2200, 0.012))                       # lecture-hall murmur
put(sfx, 24.36, room(np.concatenate([marimba(hz(76), 0.3), np.zeros(4000)])), 0.2); put(sfx, 24.46, room(marimba(hz(83), 0.45)), 0.2)
put(sfx, 24.55, whoosh(0.4, 1500, 6000, 0.08))
put(sfx, 25.84, whoosh(0.24, 300, 3000, 0.16))
# market + hot oil
murmur = bp(rng.standard_normal(int(SR * 8.0)), 250, 1800) * 0.018 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.7 * tt(8.0)))
put(sfx, 26.0, murmur)
sizzle = hp(rng.standard_normal(int(SR * 5.2)), 3000) * 0.012
put(sfx, 26.0, sizzle)
for i in range(70):
    put(sfx, 26.0 + rng.random() * 5.0, click(3000 + rng.random() * 3000, 0.05 + rng.random() * 0.08))
put(sfx, 28.0, whoosh(0.3, 1200, 5000, 0.06)); put(sfx, 28.34, whoosh(0.3, 1200, 5000, 0.06))   # hands wiped on the pagne
put(sfx, 28.72, whoosh(0.3, 1000, 5000, 0.1))
put(sfx, 31.2, click(2600, 0.4)); put(sfx, 31.22, woodblock(1600), 0.2)                         # latch
put(sfx, 31.8, crinkle(0.25, 0.18)); put(sfx, 32.4, crinkle(0.3, 0.15))                        # notes
# end card
put(sfx, 34.3, thump(0.5, 90)); put(sfx, 34.32, whoosh(0.3, 1500, 7000, 0.1))
put(sfx, 35.24, room(marimba(hz(84), 0.5, 0.4)), 0.14)

# ------------------------------------------------------------------ voices
LINES = json.load(open(os.path.join(HERE, "vo", "lines.json")))
voice = np.zeros(N); duck = np.ones(N)
for L in LINES:
    a, sr = sf.read(os.path.join(HERE, "vo", L["id"] + ".wav"))
    if a.ndim > 1: a = a.mean(1)
    a = resample_poly(a, SR, sr)
    a = hp(a, 90)
    a = a / (np.abs(a).max() + 1e-9) * 0.8
    if L["id"] != "endvo": a = room(a, 0.08, 0.05)[: len(a) + int(SR * 0.15)]
    put(voice, L["start"], a, 1.0)
    i0, i1 = int(L["start"] * SR), int(L["end"] * SR)
    duck[max(0, i0 - int(SR * 0.08)): min(N, i1 + int(SR * 0.15))] = 0.38
k = int(SR * 0.08); duck = np.convolve(duck, np.ones(k) / k, mode="same")

# ------------------------------------------------------------------ mix
music[int(7.5 * SR): int(8.0 * SR)] *= np.linspace(1, 0, int(0.5 * SR)) ** 4     # the power cut kills the music
drums[int(7.5 * SR): int(8.0 * SR)] = 0
pre_drop = int(DROP * SR)
music[:pre_drop] = lp(music[:pre_drop], 2400, 2) * 1.15                               # warmer, muffled before the drop
fade = int(SR * 0.5)
for b in (music, drums): b[-fade:] *= np.linspace(1, 0, fade)

def stereo(x, pan=0.0):
    return np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1)

bed = (stereo(room(music, 0.12)[:N], -0.12) + stereo(drums, 0.1)) * duck[:, None]
mix = bed * 0.75 + stereo(sfx) * 0.85 + stereo(voice) * 1.0

def write(path, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    sf.write(path, x.astype(np.float32), SR, subtype="PCM_16")

write(os.path.join(HERE, "music.wav"), bed); write(os.path.join(HERE, "sfx.wav"), stereo(sfx)); write(os.path.join(HERE, "voice.wav"), stereo(voice))
pre = os.path.join(HERE, "mix_pre.wav"); write(pre, mix)
p1 = subprocess.run(["ffmpeg", "-hide_banner", "-i", pre, "-af", "loudnorm=I=-14:TP=-1.3:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(p1[p1.rindex("{"): p1.rindex("}") + 1])
af = (f"loudnorm=I=-14:TP=-1.3:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af", af, "-ar", str(SR), os.path.join(HERE, "mix.wav")], check=True)
os.remove(pre)
print("wrote music.wav, sfx.wav, voice.wav, mix.wav")
