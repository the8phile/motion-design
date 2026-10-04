import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, range} from '../anim';
import {C, FONT} from '../theme';
import {PhotoBackdrop, PhotoCard} from '../components/Photo';

const PHOTO = 'photos/cours-amphi.jpg';

/** Poster-style human beat: real classroom, bold headline, yellow italic band. */
export const Focus: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = range(f, [0, 105], [1.04, 1.16]);
  const card = ease(f, 0, 18);
  const l1 = ease(f, 8, 16);
  const l2 = ease(f, 14, 16);
  const band = ease(f, 30, 16);
  const bandText = ease(f, 38, 14);
  return (
    <AbsoluteFill style={{fontFamily: FONT, background: C.ink}}>
      <PhotoBackdrop src={PHOTO} zoom={zoom} tint="rgba(255,248,236,0.72)" />

      <div style={{position: 'absolute', top: 150, left: 70, right: 70, color: C.ink}}>
        <div
          style={{
            fontSize: 132,
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: -4,
            textTransform: 'uppercase',
            opacity: l1,
            transform: `translateY(${lerp(l1, 50, 0)}px)`,
          }}
        >
          Concentrez-vous
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 400,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            marginTop: 10,
            opacity: l2,
            transform: `translateY(${lerp(l2, 50, 0)}px)`,
          }}
        >
          sur vos cours.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          height: 150,
          width: `${band * 88}%`,
          background: `linear-gradient(90deg, ${C.yellow} 70%, rgba(255,201,51,0))`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 70,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 600,
            fontStyle: 'italic',
            color: C.ink,
            lineHeight: 1.15,
            opacity: bandText,
          }}
        >
          Kopia s'occupe
          <br />
          de l'impression.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 780,
          left: 60,
          opacity: card,
          transform: `translateY(${lerp(card, 120, 0)}px) rotate(1.5deg)`,
        }}
      >
        <PhotoCard src={PHOTO} width={960} height={960} zoom={zoom} focus="30% 50%" />
        <div
          style={{
            position: 'absolute',
            left: -10,
            bottom: 60,
            background: C.ink,
            color: C.white,
            fontSize: 38,
            fontWeight: 600,
            padding: '18px 34px',
            borderRadius: '0 999px 999px 0',
            opacity: ease(f, 46, 14),
            transform: `translateX(${lerp(ease(f, 46, 14), -200, 0)}px)`,
          }}
        >
          <span style={{color: C.green}}>✓ </span>Vos documents arrivent en salle
        </div>
      </div>
    </AbsoluteFill>
  );
};
