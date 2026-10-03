import React from 'react';
import {C, FONT} from '../theme';
import {LogoMark} from './Logo';

/** Simple phone frame with a chat header. Children render in the chat area. */
export const Phone: React.FC<{children: React.ReactNode; scale?: number}> = ({
  children,
  scale = 1,
}) => (
  <div
    style={{
      width: 640,
      height: 1180,
      borderRadius: 80,
      background: '#05080F',
      padding: 18,
      boxShadow: '0 60px 120px rgba(0,0,0,0.45)',
      transform: `scale(${scale})`,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 64,
        overflow: 'hidden',
        background: C.chatBg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: C.green,
          color: C.white,
          padding: '62px 30px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <LogoMark size={70} />
        <div>
          <div style={{fontWeight: 600, fontSize: 32}}>Kopia</div>
          <div style={{fontSize: 22, opacity: 0.85}}>en ligne</div>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

export const Bubble: React.FC<{
  out?: boolean;
  t: number; // 0..1 entrance
  children: React.ReactNode;
}> = ({out, t, children}) => {
  if (t <= 0) return null;
  return (
    <div
      style={{
        maxHeight: Math.min(1, t * 1.4) * 320,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
    <div
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start',
        maxWidth: '82%',
        background: out ? C.bubbleOut : C.white,
        color: C.ink,
        fontSize: 29,
        lineHeight: 1.35,
        padding: '16px 22px',
        borderRadius: 26,
        borderTopRightRadius: out ? 6 : 26,
        borderTopLeftRadius: out ? 26 : 6,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        opacity: Math.min(1, t * 1.5),
        transform: `translateY(${(1 - t) * 30}px) scale(${0.85 + 0.15 * t})`,
        transformOrigin: out ? 'right bottom' : 'left bottom',
      }}
    >
      {children}
    </div>
    </div>
  );
};
