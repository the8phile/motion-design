---
name: saas-motion-video
description: 'Make a promo / motion video for a software product (Kopia included) with the saas-motion-kit 7-stage process (brief → components → theme → storyboard → build → sound → deliver), human gates at every stage, the clean-or-imaginary component rule, the creative muscle (tone matrix, variety rules, component forge, transition atlas, variety audit) and the 101-theme gallery in docs/. Use when someone asks for a launch video, ad, product promo, booth loop, feature reveal or social motion piece for an app, SaaS or developer tool. Works together with the motion-design skill (see Project notes).'
---

## Project notes for this repo (read first, they override the upstream text below)

Installed from https://github.com/tugrawork-creator/saas-motion-kit (MIT, commit bc7a414, see `LICENSE`).
The kit's `playbook/`, `creative/`, `components/`, `templates/`, `tools/`, `examples/` and `docs/` live **inside
this skill folder**: every path below (`playbook/01-brief.md`, `python tools/variety_audit.py`, `docs/themes/data/*.json`)
is relative to `.claude/skills/saas-motion-video/`. Follow the upstream stages, gates and hard rules exactly, with
these adaptations:

**How this skill and `motion-design` work together** (both are installed; use both on every new film):
- **Process = this skill.** Run the 7 stages and stop at each gate for the user's decision. If the user says to
  skip gates ("just do it"), pick the recommended option at each gate, say which, and continue.
- **Craft and QA = motion-design on top**: brand/facts rules from its Kopia notes, 4 stills before a full render,
  no frozen frame except the final hold, pops/flash scan, the 1-10 critique loop until every score is 8+,
  -14 LUFS, TV-range BT.709 yuv420p with `-g 30`, honesty labels, true captions.
- **On a conflict**: creative choices (effects, transitions, type, colour, components) follow this kit's hard rules
  (for example no gradient text, no progress bars, no bounce). Rendering, audio and QA follow motion-design.
- **Build engine**: HyperFrames (this kit's contract, `playbook/05-build.md`). Fallback when HyperFrames cannot run:
  motion-design's bare `seek(t)` HTML + Playwright engine. The existing Remotion ad in `src/` stays in Remotion.

**HyperFrames in this cloud container** (verified 2026-10-10 with `examples/six-films/058-hand-drawn-marker`:
`check` passed, `snapshot` and a 12 s `render` worked):
- CLI: `npx -y hyperframes@latest <cmd>`. Once per new container: `npx hyperframes browser ensure` (downloads
  Chrome Headless Shell). `npx hyperframes doctor` shows what is missing.
- Prefix every command with `HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1` (HyperFrames sends anonymous usage
  counters by default; the user did not opt in).
- **No CDN scripts in compositions**: the headless browser cannot pass the proxy (`ERR_TUNNEL_CONNECTION_FAILED`)
  and jsDelivr is blocked for curl too. Vendor libraries from npm into the film:
  `npm pack gsap@3.14.2` → copy `package/dist/gsap.min.js` to `assets/vendor/` and point the `<script>` there
  (same for Three.js). Fonts and images must be local files as well.
- The HyperFrames **skills** are installed in `.claude/skills/` (installed 2026-10-10 at the user's request:
  `hyperframes` entry point, `general-video`, `product-launch-video`, `hyperframes-core`, `-animation`, `-audio`,
  `-cli`, `-creative`, `media-use`, `music-to-video` and more). Use them at stage 5 exactly as the kit says;
  their project notes (top of `.claude/skills/hyperframes/SKILL.md`) cover CDN vendoring and telemetry.
- Optional tools that need paid keys the user has not provided: `tools/fal_shots.py` (FAL_KEY), HyperFrames
  describe/TTS/voice features (GEMINI_API_KEY, HEYGEN_API_KEY, ELEVENLABS_API_KEY). Use free local paths instead:
  Kokoro voice-over and synthesised music/SFX from the repo's `scripts/`.
- MusicGen weights are CC-BY-NC: never in a commercial Kopia film.

**Motion ledger**: `~/.motion-ledger.json` is wiped with the container. Use the committed
`films/.motion-ledger.json` instead (create it on the first `--append`) in every `--history` / `--append` call, so
the "no two films alike" rule remembers past films across sessions. The Kopia Remotion ad (Oct 2026) counts as a
previous film: chat-phone UI, coin-in-lock escrow, scooter route map, PIN card, photo cards, circle wipe.

**Kopia brand, facts and rights**: see the Kopia notes in `.claude/skills/motion-design/SKILL.md` (official logo files in `brand/`, the brand guide palette Blue #0D5EF4 / Red #EF2F3C / White / Navy #0B1B3A, Poppins Bold;
Poppins/Inter, sourced prices, French 9:16 default, WhatsApp not live, photo-rights warnings). For Kopia the
"truth source" in the brief is kopia.online plus what the user tells you.


# saas-motion-video

You are the producer. The user is the creative director. Run the stages in order and **stop at every gate** for a human decision. Keep the user's taste in the loop; that is what makes the film feel human-made.

**The one rule of this kit: no two films should feel like the same film.** Don't repeat effects, transitions or components (within the film, or from the user's recent films). Invent at least one new component per film. Decide the message and the tone before choosing any effect. Read `creative/README.md` before stage 4.

## Before starting
- The HyperFrames skills must be installed (`npx skills add heygen-com/hyperframes`). If `/hyperframes` is not available, ask the user to install them and restart the session.
- Read `playbook/README.md`. Read each stage file when you reach that stage.

## Stages

1. **Brief** (`playbook/01-brief.md`). Ask at most four questions: the one message, the channel/format, the sound (music, SFX, voice or silent) and the truth source (a URL or docs). Also ask whether they have reference videos they love. For each one, run `python tools/breakdown.py <video> --id NN --creator … --url …` and credit it in `REFERENCES.md` (`templates/REFERENCES.md`, `creative/references.md`): borrow grammar, never assets. Write `BRIEF.md` from `templates/BRIEF.md`. **Gate:** the user confirms the brief.
2. **Components** (`playbook/02-components.md`, `components/README.md`). If there is a URL, run `npx hyperframes capture`. Score the real UI and propose, per component, *real* or *imaginary*. Never invent capabilities, customers or statistics. **Gate:** the user approves the inventory.
3. **Theme** (`playbook/03-theme.md`). Suggest 2–3 themes from `docs/themes/data/*.json` that fit the audience (read their `summary`, `fit` and `best_for`). Start from `python tools/pick_themes.py --tone <the brief's tone> --audience "<audience words>" --history ~/.motion-ledger.json`, which skips the themes of the user's last five films. Redraw each candidate's proof-moment frame in the user's brand as a quick HTML still. **Gate:** the user picks one.
4. **Storyboard + creative pass** (`playbook/04-storyboard.md`, `creative/`). Write `STORYBOARD.md` from `templates/STORYBOARD.md`: first the **Message & tone** sentence ("I want to say ___ in a ___ tone, so the viewer feels ___"), then the **ledger** (one row per shot: entrance, transition, ease, direction, palette, camera, components, new component, sfx, notes), then the frames. Choose craft from `creative/tone-matrix.md`, transitions from `creative/transition-atlas.md` (plus HyperFrames' stock set), and forge at least one new component with `creative/component-forge.md`. Run `python tools/variety_audit.py STORYBOARD.md --history ~/.motion-ledger.json` and fix every warning, or mark a deliberate repeat as `motif:`. Then draw a one-page sketch sheet. Keep on-screen words to a minimum. **Gate:** the audit is clean (or every remaining warning is explained), and the stills read as a story with the sound off.
5. **Build** (`playbook/05-build.md`). Hand off to the HyperFrames workflow (`/product-launch-video` for a URL-driven promo, `/general-video` for loops and custom pieces). Keep every frame seek-safe and deterministic. Run `lint`, `snapshot` and `check`. **Gate:** the user approves the preview.
6. **Sound** (`playbook/06-sound.md`). Music-driven: build a beat grid first and cut on bars. SFX: use warm tuned timbres (`tools/warm_sfx.py`). Silent is a valid choice. **Gate:** the user approves the mix.
7. **Deliver** (`playbook/07-deliver.md`). Render at 4K, then run `tools/deliver.sh` to downscale. For loops, run `tools/loop_check.py`. Report the actual duration, size and path. Record the film so the next one avoids it: `python tools/variety_audit.py STORYBOARD.md --history ~/.motion-ledger.json --append "<film>" --theme <NNN>`. Every few films, offer `python tools/history_report.py ~/.motion-ledger.json -o motion-history.html` so the user can see what they keep reaching for. **Gate:** the user checks it on the target screen.

## Hard rules
- Official logos only. Never redraw a brand mark.
- For non-Latin characters, bundle `latin-ext` font subsets locally. Write uppercase text yourself instead of relying on CSS `text-transform` (which breaks Turkish i/İ).
- No progress bars, no gradient text, no pure #000/#fff, no bounce or elastic easing on UI.
- Fewer words. If the story needs reading, redesign the frame.
- Credit every reference video by name and link (`REFERENCES.md` and `ref:<id>` in the ledger; the audit enforces it). Never put someone else's footage, frames or music in a film or the repo.
- Every transition must answer "why this one, here?". No transition twice in a row, at least three transition families, one surprise every ~15 s.
