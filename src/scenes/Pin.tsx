import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop} from '../anim';
import {C, FONT} from '../theme';
import {Caption} from '../components/Caption';

const DIGITS = ['4', '8', '2', '1'];
const SPLIT = [
  {label: 'Boutique', value: 480, color: C.yellow},
  {label: 'Coursier', value: 150, color: C.green},
  {label: 'Kopia', value: 50, color: C.red},
];

export const Pin: React.FC = () => {
  const f = useCurrentFrame();
  const ok = ease(f, 44, 8);
  const check = pop(f, 46, 10);
  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: FONT, alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 160, width: '100%'}}>
        <Caption step="Étape 5" title="Donnez votre code PIN au coursier" sub="Et seulement là, l'argent est versé." />
      </div>

      <div style={{position: 'absolute', top: 650, display: 'flex', gap: 30}}>
        {DIGITS.map((d, i) => {
          const t = pop(f, 12 + i * 7, 11);
          return (
            <div
              key={i}
              style={{
                width: 170,
                height: 210,
                borderRadius: 34,
                background: ok > 0 ? `rgba(18,161,80,${ok})` : C.inkSoft,
                border: `6px solid ${ok > 0.5 ? C.green : '#2C3D58'}`,
                color: C.white,
                fontSize: 120,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{transform: `scale(${t})`, display: 'inline-block'}}>{d}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 920,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          transform: `scale(${check})`,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 99,
            background: C.green,
            color: C.white,
            fontSize: 64,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✓
        </div>
        <div style={{color: C.white, fontSize: 72, fontWeight: 800}}>Livré !</div>
      </div>

      <div style={{position: 'absolute', top: 1110, width: 860}}>
        <div style={{color: C.muted, fontSize: 32, marginBottom: 24, opacity: ease(f, 58, 10)}}>
          Vos 680 XAF sont répartis :
        </div>
        {SPLIT.map((s, i) => {
          const t = ease(f, 62 + i * 6, 20);
          return (
            <div key={s.label} style={{marginBottom: 26, opacity: Math.min(1, t * 3)}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: C.white,
                  fontSize: 38,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <span>{s.label}</span>
                <span>{Math.round(lerp(t, 0, s.value))} XAF</span>
              </div>
              <div style={{height: 26, background: C.inkSoft, borderRadius: 13}}>
                <div
                  style={{
                    height: '100%',
                    width: `${(s.value / 480) * 100 * t}%`,
                    background: s.color,
                    borderRadius: 13,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
