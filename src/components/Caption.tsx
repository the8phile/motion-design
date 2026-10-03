import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ease, lerp} from '../anim';
import {C, FONT} from '../theme';

/** Step badge + headline used at the top of each "how it works" scene. */
export const Caption: React.FC<{
  step?: string;
  title: string;
  sub?: string;
  color?: string;
  delay?: number;
}> = ({step, title, sub, color = C.white, delay = 0}) => {
  const f = useCurrentFrame();
  const a = ease(f, delay, 18);
  const b = ease(f, delay + 6, 18);
  return (
    <div style={{fontFamily: FONT, textAlign: 'center', padding: '0 70px'}}>
      {step && (
        <div
          style={{
            display: 'inline-block',
            background: C.yellow,
            color: C.ink,
            fontWeight: 800,
            fontSize: 34,
            padding: '10px 28px',
            borderRadius: 999,
            marginBottom: 26,
            opacity: a,
            transform: `scale(${lerp(a, 0.6, 1)})`,
          }}
        >
          {step}
        </div>
      )}
      <div
        style={{
          color,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.08,
          letterSpacing: -1.5,
          opacity: a,
          transform: `translateY(${lerp(a, 40, 0)}px)`,
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            color,
            opacity: b * 0.75,
            fontWeight: 400,
            fontSize: 38,
            marginTop: 20,
            lineHeight: 1.3,
            transform: `translateY(${lerp(b, 30, 0)}px)`,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};
