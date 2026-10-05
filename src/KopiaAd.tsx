import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {smooth} from './anim';
import {Hook} from './scenes/Hook';
import {Reveal} from './scenes/Reveal';
import {Chat} from './scenes/Chat';
import {Escrow} from './scenes/Escrow';
import {Deliver} from './scenes/Deliver';
import {Pin} from './scenes/Pin';
import {Cta} from './scenes/Cta';
import {Focus} from './scenes/Focus';

// Scene lengths in frames (30 fps). Each scene overlaps the previous by OVERLAP.
const SCENES: {C: React.FC; dur: number; fadeIn: boolean}[] = [
  {C: Hook, dur: 105, fadeIn: false},
  {C: Reveal, dur: 90, fadeIn: false}, // has its own circle wipe
  {C: Chat, dur: 240, fadeIn: true},
  {C: Escrow, dur: 110, fadeIn: true},
  {C: Deliver, dur: 160, fadeIn: true},
  {C: Pin, dur: 115, fadeIn: true},
  {C: Focus, dur: 105, fadeIn: true},
  {C: Cta, dur: 170, fadeIn: true},
];
const OVERLAP = 8;

export const AD_DURATION =
  SCENES.reduce((sum, s) => sum + s.dur, 0) - OVERLAP * (SCENES.length - 1);

/**
 * Wraps a scene: an even crossfade in (with a slight settle from 104% scale)
 * and a slow camera push-in for its whole length, so no frame is ever static.
 */
const SceneShell: React.FC<{fadeIn: boolean; dur: number; children: React.ReactNode}> = ({
  fadeIn,
  dur,
  children,
}) => {
  const f = useCurrentFrame();
  const t = fadeIn ? smooth(f, 0, OVERLAP) : 1;
  const push = 1 + 0.03 * (f / dur);
  const settle = fadeIn ? 1.04 - 0.04 * t : 1;
  return (
    <AbsoluteFill style={{opacity: t, transform: `scale(${push * settle})`}}>{children}</AbsoluteFill>
  );
};

export const KopiaAd: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#0E1A2B'}}>
      {/* Music, voice-over and sound effects, pre-mixed by scripts/mix_audio.py */}
      <Audio src={staticFile('audio/mix.wav')} />
      {SCENES.map(({C, dur, fadeIn}, i) => {
        const start = from;
        from += dur - OVERLAP;
        return (
          <Sequence key={i} from={start} durationInFrames={dur} premountFor={30}>
            <SceneShell fadeIn={fadeIn} dur={dur}>
              <C />
            </SceneShell>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
