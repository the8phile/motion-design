import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ease} from './anim';
import {Hook} from './scenes/Hook';
import {Reveal} from './scenes/Reveal';
import {Chat} from './scenes/Chat';
import {Escrow} from './scenes/Escrow';
import {Deliver} from './scenes/Deliver';
import {Pin} from './scenes/Pin';
import {Cta} from './scenes/Cta';

// Scene lengths in frames (30 fps). Each scene overlaps the previous by OVERLAP.
const SCENES: {C: React.FC; dur: number; fadeIn: boolean}[] = [
  {C: Hook, dur: 105, fadeIn: false},
  {C: Reveal, dur: 90, fadeIn: false}, // has its own circle wipe
  {C: Chat, dur: 240, fadeIn: true},
  {C: Escrow, dur: 110, fadeIn: true},
  {C: Deliver, dur: 160, fadeIn: true},
  {C: Pin, dur: 115, fadeIn: true},
  {C: Cta, dur: 140, fadeIn: true},
];
const OVERLAP = 8;

export const AD_DURATION =
  SCENES.reduce((sum, s) => sum + s.dur, 0) - OVERLAP * (SCENES.length - 1);

const FadeIn: React.FC<{on: boolean; children: React.ReactNode}> = ({on, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: on ? ease(f, 0, OVERLAP) : 1}}>{children}</AbsoluteFill>;
};

export const KopiaAd: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#0E1A2B'}}>
      {SCENES.map(({C, dur, fadeIn}, i) => {
        const start = from;
        from += dur - OVERLAP;
        return (
          <Sequence key={i} from={start} durationInFrames={dur} premountFor={30}>
            <FadeIn on={fadeIn}>
              <C />
            </FadeIn>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
