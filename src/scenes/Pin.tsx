import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT, UI_FONT} from '../theme';
import {Caption} from '../components/Caption';
import {LogoMark} from '../components/Logo';
import {Bubble, ChatScreen, ScaledPhone} from '../components/Phone';

const DIGITS = ['4', '8', '2', '1'];
const SPLIT = [
  {label: 'Boutique', value: 480, color: C.yellow},
  {label: 'Coursier', value: 150, color: C.green},
  {label: 'Kopia', value: 50, color: C.red},
];

/** iOS-style notification banner dropping in under the Dynamic Island. */
const Notification: React.FC<{t: number}> = ({t}) => (
  <div
    style={{
      position: 'absolute',
      top: 84,
      left: 14,
      right: 14,
      zIndex: 8,
      borderRadius: 34,
      background: 'rgba(250,250,250,0.94)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
      padding: '18px 22px',
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      fontFamily: UI_FONT,
      color: '#111B21',
      opacity: Math.min(1, t * 2),
      transform: `translateY(${lerp(t, -220, 0)}px) scale(${lerp(t, 0.9, 1)})`,
    }}
  >
    <LogoMark size={64} />
    <div style={{flex: 1}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#667781'}}>
        <span style={{fontWeight: 600, letterSpacing: 0.5}}>KOPIA</span>
        <span>maintenant</span>
      </div>
      <div style={{fontWeight: 600, fontSize: 26}}>Votre coursier est arrivé 🛵</div>
      <div style={{fontSize: 24}}>Donnez-lui votre code PIN.</div>
    </div>
  </div>
);

export const Pin: React.FC = () => {
  const f = useCurrentFrame();
  const enter = pop(f, 0, 15);
  const notif = pop(f, 8, 13) * (1 - ease(f, 58, 10));
  const done = ease(f, 46, 8);

  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: FONT, alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 130, width: '100%'}}>
        <Caption step="Étape 5" title="Donnez votre code PIN au coursier" sub="Et seulement là, l'argent est versé." />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 510,
          transform: `translateY(${lerp(enter, 700, 0)}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -180,
            top: 120,
            width: 820,
            height: 820,
            borderRadius: 9999,
            background: `radial-gradient(circle, rgba(18,161,80,${0.12 + done * 0.18}) 0%, rgba(18,161,80,0) 65%)`,
          }}
        />
        <ScaledPhone
          scale={0.74}
          rotateX={lerp(enter, 20, 6) + Math.sin(f / 50) * 1.2}
          rotateY={lerp(enter, 30, 10) + Math.sin(f / 36) * 2}
          rotateZ={lerp(enter, -6, 0)}
          sheen={range(f, [0, 115], [0.1, 0.9])}
        >
          <Notification t={notif} />
          <ChatScreen>
            <Bubble t={1} time="10:41">🛵 Votre coursier est en route vers votre salle.</Bubble>
            <Bubble t={pop(f, 14, 14)} time="10:46">
              <div>🔑 Donnez ce code au coursier :</div>
              <div style={{display: 'flex', gap: 10, margin: '10px 0 4px'}}>
                {DIGITS.map((d, i) => {
                  const t = pop(f, 20 + i * 5, 11);
                  return (
                    <div
                      key={i}
                      style={{
                        width: 78,
                        height: 96,
                        borderRadius: 16,
                        background: done > 0 ? `rgba(18,161,80,${0.15 + done * 0.85})` : '#F0F2F5',
                        color: done > 0.5 ? C.white : '#111B21',
                        fontSize: 58,
                        fontWeight: 700,
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
            </Bubble>
            <Bubble t={pop(f, 50, 12)} time="10:47">
              <span style={{color: C.green, fontWeight: 700}}>✅ Livré ! Merci d'utiliser Kopia.</span>
            </Bubble>
          </ChatScreen>
        </ScaledPhone>
      </div>

      <div style={{position: 'absolute', top: 1475, width: 860}}>
        <div style={{color: C.muted, fontSize: 32, marginBottom: 20, opacity: ease(f, 58, 10)}}>
          Vos 680 XAF sont répartis :
        </div>
        {SPLIT.map((s, i) => {
          const t = ease(f, 62 + i * 6, 20);
          return (
            <div key={s.label} style={{marginBottom: 20, opacity: Math.min(1, t * 3)}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: C.white,
                  fontSize: 34,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                <span>{s.label}</span>
                <span>{Math.round(lerp(t, 0, s.value))} XAF</span>
              </div>
              <div style={{height: 22, background: C.inkSoft, borderRadius: 11}}>
                <div
                  style={{
                    height: '100%',
                    width: `${(s.value / 480) * 100 * t}%`,
                    background: s.color,
                    borderRadius: 11,
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
