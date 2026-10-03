import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop} from '../anim';
import {C, FONT} from '../theme';
import {LogoMark} from '../components/Logo';

export const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = ease(f, 0, 20);
  const logo = pop(f, 8, 10);
  const l1 = ease(f, 34, 18);
  const l2 = ease(f, 44, 18);
  return (
    <AbsoluteFill style={{fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          width: 4200,
          height: 4200,
          borderRadius: 9999,
          background: C.yellow,
          transform: `scale(${wipe})`,
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{transform: `scale(${logo}) rotate(${lerp(logo, -25, 0)}deg)`}}>
          <LogoMark size={260} />
        </div>
        <div style={{display: 'flex', marginTop: 40}}>
          {'KOPIA'.split('').map((ch, i) => {
            const t = pop(f, 16 + i * 3, 12);
            return (
              <span
                key={i}
                style={{
                  fontSize: 170,
                  fontWeight: 800,
                  color: C.ink,
                  letterSpacing: 6,
                  opacity: Math.min(1, t * 2),
                  transform: `translateY(${lerp(t, 80, 0)}px)`,
                  display: 'inline-block',
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 30,
            textAlign: 'center',
            color: C.ink,
            fontSize: 60,
            fontWeight: 600,
            lineHeight: 1.25,
          }}
        >
          <div style={{opacity: l1, transform: `translateY(${lerp(l1, 30, 0)}px)`}}>
            Imprimez vos documents.
          </div>
          <div style={{opacity: l2, transform: `translateY(${lerp(l2, 30, 0)}px)`}}>
            On les livre <span style={{fontWeight: 800}}>jusqu'en salle.</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
