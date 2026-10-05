import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT} from '../theme';
import {PhotoBackdrop, PhotoCard} from '../components/Photo';

const MAIN = 'photos/campus-1.jpg';
const SECOND = 'photos/campus-2.jpg';

const Pin: React.FC<{t: number; label: string}> = ({t, label}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: C.white,
      color: C.ink,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 34,
      padding: '14px 28px 14px 16px',
      borderRadius: 999,
      boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
      opacity: Math.min(1, t * 2),
      transform: `translateY(${lerp(t, 40, 0)}px) scale(${lerp(t, 0.6, 1)})`,
    }}
  >
    <svg width={44} height={54} viewBox="0 0 24 30">
      <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 30 12 30s12-9.6 12-18.3C24 5.2 18.6 0 12 0z" fill={C.red} />
      <circle cx={12} cy={11.5} r={4.6} fill={C.white} />
    </svg>
    {label}
  </div>
);

/** Real campus photos: Kopia partner shops sit around the student's campus. */
export const Campus: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = range(f, [0, 90], [1, 1.1]);
  const head = ease(f, 4, 16);
  const sub = ease(f, 12, 16);
  const card1 = pop(f, 2, 14);
  const card2 = pop(f, 18, 14);
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: C.ink}}>
      <PhotoBackdrop src={MAIN} zoom={zoom} tint="rgba(14,26,43,0.7)" />

      <div style={{position: 'absolute', top: 170, left: 70, right: 70, color: C.white}}>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -3,
            opacity: head,
            transform: `translateY(${lerp(head, 40, 0)}px)`,
          }}
        >
          Autour de <span style={{color: C.yellow}}>votre campus</span>
        </div>
        <div
          style={{
            fontSize: 42,
            marginTop: 18,
            opacity: sub * 0.85,
            transform: `translateY(${lerp(sub, 30, 0)}px)`,
          }}
        >
          Des boutiques partenaires près de vous
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 590,
          left: 50,
          opacity: Math.min(1, card1 * 2),
          transform: `translateY(${lerp(card1, 300, 0)}px) rotate(${lerp(card1, -8, -2)}deg)`,
        }}
      >
        <PhotoCard src={MAIN} width={980} height={760} zoom={zoom} focus="50% 55%" />
        <div style={{position: 'absolute', left: 40, top: 40}}>
          <Pin t={pop(f, 30, 12)} label="Boutique partenaire" />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1300,
          right: 50,
          opacity: Math.min(1, card2 * 2),
          transform: `translateX(${lerp(card2, 500, 0)}px) rotate(${lerp(card2, 10, 3)}deg)`,
        }}
      >
        <PhotoCard src={SECOND} width={760} height={400} zoom={zoom} focus="50% 50%" style={{border: `8px solid ${C.white}`}} />
        <div style={{position: 'absolute', left: -60, bottom: -50}}>
          <Pin t={pop(f, 40, 12)} label="Livré jusqu'en salle" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
