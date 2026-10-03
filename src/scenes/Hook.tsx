import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop} from '../anim';
import {C, FONT} from '../theme';

const WORDS = ['Encore', 'la', 'queue', 'à', "l'imprimerie", '?'];

const Person: React.FC<{i: number; f: number}> = ({i, f}) => {
  const t = pop(f, 30 + i * 3, 14);
  const bob = Math.sin((f + i * 7) / 6) * 4;
  const color = i === 6 ? C.red : C.inkSoft;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${lerp(t, 200, 0) + bob}px)`,
        opacity: t,
      }}
    >
      <div style={{width: 62, height: 62, borderRadius: 999, background: color}} />
      <div
        style={{
          width: 92,
          height: 150,
          marginTop: 10,
          borderRadius: '46px 46px 16px 16px',
          background: color,
        }}
      />
    </div>
  );
};

const Clock: React.FC<{f: number}> = ({f}) => {
  const t = pop(f, 45);
  const minute = f * 24;
  const hour = f * 2;
  return (
    <div
      style={{
        width: 190,
        height: 190,
        borderRadius: 999,
        border: `14px solid ${C.ink}`,
        background: C.white,
        position: 'relative',
        transform: `scale(${t})`,
      }}
    >
      {[hour, minute].map((deg, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: 12,
            height: k === 0 ? 46 : 66,
            marginLeft: -6,
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
  const sub = ease(f, 55, 18);
  return (
    <AbsoluteFill
      style={{
        background: C.cream,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 70,
      }}
    >
      <Clock f={f} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 26px',
          padding: '0 80px',
          fontSize: 112,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.1,
          color: C.ink,
        }}
      >
        {WORDS.map((w, i) => {
          const t = pop(f, i * 5, 11);
          const hl = w === 'queue';
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: Math.min(1, t * 2),
                transform: `translateY(${lerp(t, 60, 0)}px) scale(${lerp(t, 0.7, 1)})`,
                color: hl ? C.red : C.ink,
                position: 'relative',
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 22, alignItems: 'flex-end'}}>
        {Array.from({length: 7}).map((_, i) => (
          <Person key={i} i={i} f={f} />
        ))}
      </div>
      <div
        style={{
          fontSize: 44,
          color: C.ink,
          opacity: sub * 0.7,
          transform: `translateY(${lerp(sub, 30, 0)}px)`,
        }}
      >
        …et le prochain cours commence.
      </div>
    </AbsoluteFill>
  );
};
