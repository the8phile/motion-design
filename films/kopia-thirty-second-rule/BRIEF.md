---
workflow: general-video        # custom story piece, no capturable URL (kopia.online is blocked from this container)
format: 1080x1920
duration: 37s
audio: voice                   # 4 character lines + 1 end line (Kokoro TTS, chosen by the user) + music + SFX
loop: false
theme: "087 Cut-Paper Title Sequence (adapted, with 029's on-twos boil)"
---

# Kopia — The Thirty-Second Rule

**One message:** Your hard work, perfectly presented.

**Script:** `stories/the-thirty-second-rule.md` (approved by the user on 2026-10-10), written with the
`kopia-story` skill's 4-character framework: Mentor (Dr. Mbarga) → Protagonist (Nadège) → Kopia attendant
(Serge) → Proud Supporter (Maman Ekobena) → end card.

**Audience & channel:** students on Cameroonian campuses (and their families), on phones. WhatsApp Status,
TikTok, Reels. English, as scripted. Plays muted on Reels, so all dialogue is subtitled on screen.

**Truth source:** kopia.online (facts in `facts.md`, same list as the motion-design skill's Kopia notes).
On screen we only claim: order on kopia.online, typing service, printing, 2 copies, delivery to the
classroom, MTN MoMo, payment released at the PIN handover. No prices, times, coverage or partner schools.
No WhatsApp call to action.

**Proof moment:** Serge's screen turns Nadège's messy handwritten pages into a clean, typed, formatted plan,
then the printer delivers crisp pages.

**Components**
| Component | Real or imaginary | Notes |
|---|---|---|
| kopia.online order screen on the phone | imaginary | simplified; the real portal can't be captured from here. Swap in real screens before release |
| Typing + printing at a partner print shop | imaginary illustration of a real service | typing service and partner shops are real (kopia.online) |
| Courier + PIN handover | imaginary illustration of a real flow | PIN digits are not shown |
| Characters, places | imaginary | cut-paper illustrations, no real people or institutions |
| KOPIA logo | real | rebuilt to the measured geometry of `brand/kopia-logo-on-blue.jpg` (tile 331 px, radius ~74, red copy offset 26 px, Poppins Bold). Replace with the official SVG when supplied |

**Brand:** new brand guide (`brand/kopia-brand-guide.jpg`): KOPIA Blue #0D5EF4, KOPIA Red #EF2F3C,
White #FFFFFF (logo only; elsewhere off-white), Navy #0B1B3A · Poppins Bold. Blue is kept out of the film
until Kopia enters (the phone order at 0:13). Red only belongs to the logo's copy tile and the plan's copy.

**Voices (synthetic, Kokoro TTS, offline):** Dr. Mbarga `bm_george`, Maman `af_heart`, end line `af_bella`.
They are synthetic and not Cameroonian accents; the user chose them knowingly.

**Do / Don't:** few words on screen; every claim from facts.md; no gradient text, no progress bars, no bounce;
no repeats of the earlier Kopia films' devices (chat phone, coin lock, scooter map, PIN digit card, photo cards,
circle wipe, margin tabs, overhead desk rig, colour-flood CTA).

**Deliverables:** `renders/kopia-thirty-second-rule-1080x1920.mp4` (H.264, -14 LUFS, TV-range BT.709, `-g 30`),
source in `films/kopia-thirty-second-rule/`.
