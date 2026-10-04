import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT} from '../theme';
import {PhotoBackdrop, PhotoCard} from '../components/Photo';

const WORDS = ['Encore', 'la', 'queue', 'à', "l'imprimerie", '?'];
const PHOTO = 'photos/amphi-etudiants.jpg';

const Clock: React.FC<{f: number}> = ({f}) => {
  const t = pop(f, 30, 11);
  return (
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: 999,
        border: `12px solid ${C.ink}`,
        background: C.yellow,
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
        transform: `scale(${t}) rotate(${lerp(t, -30, 8)}deg)`,
      }}
    >
      {[f * 2, f * 24].map((deg, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: 11,
            height: k === 0 ? 40 : 58,
            marginLeft: -5.5,
            borderRadius: 6,
            background: k === 0 ? C.ink : C.red,
            transformOrigin: '50% 100%',
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = range(f, [0, 105], [1, 1.12]);
  const card = ease(f, 0, 20);
  const sub = ease(f, 48, 18);
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: C.ink}}>
      <PhotoBackdrop src={PHOTO} zoom={zoom} />

      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 50,
          opacity: card,
          transform: `translateY(${lerp(card, 80, 0)}px) rotate(-2deg)`,
        }}
      >
        <PhotoCard src={PHOTO} width={980} height={860} zoom={zoom} focus="55% 60%" />
        <div style={{position: 'absolute', right: -20, top: -60}}>
          <Clock f={f} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1220,
          left: 0,
          right: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 26px',
          padding: '0 70px',
          fontSize: 116,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.08,
          color: C.white,
          textShadow: '0 6px 30px rgba(0,0,0,0.35)',
        }}
      >
        {WORDS.map((w, i) => {
          const t = pop(f, 6 + i * 5, 11);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: Math.min(1, t * 2),
                transform: `translateY(${lerp(t, 60, 0)}px) scale(${lerp(t, 0.7, 1)})`,
                color: w === 'queue' ? C.yellow : C.white,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1580,
          width: '100%',
          textAlign: 'center',
          fontSize: 48,
          color: C.white,
          opacity: sub * 0.85,
          transform: `translateY(${lerp(sub, 30, 0)}px)`,
        }}
      >
        …et le cours qui commence.
      </div>
    </AbsoluteFill>
  );
};
