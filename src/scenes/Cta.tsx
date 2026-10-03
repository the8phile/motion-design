import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop} from '../anim';
import {C, FONT} from '../theme';
import {LogoMark} from '../components/Logo';

export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 0, 11);
  const price = pop(f, 10, 12);
  const btn = pop(f, 26, 11);
  const pulse = 1 + Math.sin(Math.max(0, f - 40) / 5) * 0.025 * (f > 40 ? 1 : 0);
  const fade = (d: number) => ({
    opacity: ease(f, d, 14),
    transform: `translateY(${lerp(ease(f, d, 14), 30, 0)}px)`,
  });
  return (
    <AbsoluteFill
      style={{
        background: C.yellow,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        color: C.ink,
        textAlign: 'center',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 30, transform: `scale(${logo})`}}>
        <LogoMark size={150} />
        <div style={{fontSize: 130, fontWeight: 800, letterSpacing: 4}}>KOPIA</div>
      </div>
      <div style={{fontSize: 40, fontWeight: 600, marginTop: 20, ...fade(6)}}>
        Impression & livraison campus
      </div>

      <div style={{marginTop: 90, transform: `scale(${price})`}}>
        <div style={{fontSize: 46, fontWeight: 600}}>Dès</div>
        <div style={{fontSize: 190, fontWeight: 800, lineHeight: 1, letterSpacing: -4}}>25 XAF</div>
        <div style={{fontSize: 52, fontWeight: 600}}>la page</div>
      </div>
      <div style={{fontSize: 40, marginTop: 30, ...fade(18)}}>Livraison jusqu'en salle : 200 XAF</div>

      <div
        style={{
          marginTop: 80,
          background: C.ink,
          color: C.yellow,
          fontSize: 50,
          fontWeight: 800,
          padding: '32px 60px',
          borderRadius: 999,
          transform: `scale(${btn * pulse})`,
        }}
      >
        Commandez sur kopia.online
      </div>

      <div style={{display: 'flex', gap: 20, marginTop: 50, ...fade(34)}}>
        {['MTN MoMo', 'Orange Money'].map((m) => (
          <div
            key={m}
            style={{
              border: `4px solid ${C.ink}`,
              borderRadius: 999,
              padding: '12px 32px',
              fontSize: 34,
              fontWeight: 600,
            }}
          >
            {m}
          </div>
        ))}
      </div>
      <div style={{fontSize: 34, marginTop: 50, ...fade(44)}}>
        Parrainez un ami : <b>50 XAF offerts</b> sur sa commande
      </div>
    </AbsoluteFill>
  );
};
