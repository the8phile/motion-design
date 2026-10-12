"""Builds index.html (English) and index-fr.html (French) from the parts in src/.

  python3 src/build.py

Every on-screen word lives in src/strings.json; spoken lines and their timings live in audio/vo*/lines.json
(written by audio/make_voices.py), which also become the captions and the mouth envelopes (assets/lines*.js).
"""
import html, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
STRINGS = json.load(open("src/strings.json", encoding="utf-8"))
VARIANTS = [
    ("en", "index.html", "audio/mix.wav", "assets/lines.js", "audio/vo"),
    ("fr", "index-fr.html", "audio/mix-fr.wav", "assets/lines-fr.js", "audio/vo-fr"),
]
# latest moment each caption may stay on screen (the next cut)
CAP_LIMIT = {"mbarga1": 3.95, "mbarga2": 6.95, "maman1": 30.95, "maman2": 33.9}

for lang, out, audio, lines_js, vo in VARIANTS:
    lines_path = os.path.join(vo, "lines.json")
    if not os.path.exists(lines_path):
        print(f"skip {out}: {lines_path} missing (run audio/make_voices.py --lang {lang})")
        continue
    S = STRINGS[lang]
    lines = json.load(open(lines_path, encoding="utf-8"))
    with open(lines_js, "w", encoding="utf-8") as f:
        f.write("window.LINES = " + json.dumps([{k: l[k] for k in ("id", "start", "end", "env")} for l in lines]) + ";\n")
    caps = []
    for i, l in enumerate([l for l in lines if l["id"] in CAP_LIMIT]):
        end = min(l["end"] + 0.3, CAP_LIMIT[l["id"]])
        dur = round(max(end - l["start"], 1.45), 2)
        caps.append(f'  <div class="clip cap" id="cap{i + 1}" data-start="{l["start"]}" data-duration="{dur}" data-track-index="6">'
                    f'<div class="capbox"><span>{html.escape(l["text"])}</span></div></div>')
    head = open("src/00-head.html", encoding="utf-8").read()
    rep = dict(S, lang=lang, audio=audio, lines_js=lines_js, captions="\n".join(caps))
    for k, v in rep.items():
        head = head.replace("{{" + k + "}}", v)
    assert "{{" not in head, "unfilled placeholder in " + out
    js = "const S = " + json.dumps(S, ensure_ascii=False) + ";\n"
    js += "".join(open(p, encoding="utf-8").read() for p in ("src/10-lib.js", "src/20-scenes.js", "src/30-timeline.js"))
    with open(out, "w", encoding="utf-8") as f:
        f.write(head + "<script>\n" + js + "</script>\n</body>\n</html>\n")
    print(f"{out}: {os.path.getsize(out)} bytes ({len(caps)} captions)")
