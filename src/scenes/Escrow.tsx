import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT} from '../theme';
import {Caption} from '../components/Caption';

const CHIPS = ['Séquestre automatique', 'Coursiers vérifiés', 'Remboursement si litige'];

export const Escrow: React.FC = () => {
  const f = useCurrentFrame();
  const vault = pop(f, 4, 13);
  const coinY = range(f, [14, 40], [-300, 0]);
  const coinIn = Math.min(range(f, [12, 20], [0, 1]), range(f, [40, 48], [1, 0]));
  const lock = ease(f, 50, 10);
  const pulse = 1 + Math.max(0, Math.sin(range(f, [58, 78], [0, Math.PI]))) * 0.06;

  return (
    <AbsoluteFill style={{background: C.cream, fontFamily: FONT, alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 170, width: '100%'}}>
        <Caption
          color={C.ink}
          title="Votre argent reste bloqué chez Kopia"
          sub="Rien n'est versé avant la remise de votre commande."
        />
      </div>

      <div style={{position: 'absolute', top: 760, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/* Coin */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            zIndex: 0,
            width: 230,
            height: 230,
            borderRadius: 999,
            background: C.yellow,
            border: `12px solid #E0A800`,
            color: C.ink,
            fontWeight: 800,
            fontSize: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            opacity: coinIn,
            transform: `translateY(${coinY}px) scale(${lerp(coinIn, 0.7, 1)})`,
          }}
        >
          680
          <span style={{fontSize: 30, marginTop: 6}}>XAF</span>
        </div>
        {/* Shackle */}
        <div
          style={{
            width: 260,
            height: 220,
            border: `46px solid ${C.ink}`,
            borderBottom: 'none',
            borderRadius: '140px 140px 0 0',
            transform: `translateY(${lerp(lock, -70, 30)}px) scale(${vault})`,
            zIndex: 1,
          }}
        />
        {/* Body */}
        <div
          style={{
            width: 460,
            height: 380,
            borderRadius: 60,
            background: C.ink,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            transform: `scale(${vault * pulse})`,
          }}
        >
          <div style={{width: 160, height: 18, borderRadius: 9, background: '#2C3D58'}} />
          <div style={{color: C.yellow, fontWeight: 800, fontSize: 64, opacity: ease(f, 48, 10)}}>
            680 XAF
          </div>
          <div style={{color: C.white, opacity: ease(f, 54, 10) * 0.8, fontSize: 30}}>
            en séquestre
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 210,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          alignItems: 'center',
        }}
      >
        {CHIPS.map((c, i) => {
          const t = pop(f, 66 + i * 7, 13);
          return (
            <div
              key={c}
              style={{
                background: C.white,
                border: `3px solid ${C.ink}`,
                color: C.ink,
                fontWeight: 600,
                fontSize: 38,
                padding: '16px 36px',
                borderRadius: 999,
                opacity: Math.min(1, t * 2),
                transform: `translateX(${lerp(t, i % 2 ? 300 : -300, 0)}px)`,
              }}
            >
              <span style={{color: C.green, fontWeight: 800}}>✓ </span>
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
