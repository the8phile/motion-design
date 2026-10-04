import React from 'react';
import {C, UI_FONT} from '../theme';
import {LogoMark} from './Logo';

// Pro-class smartphone modelled on a titanium iPhone: ~2.09 aspect ratio,
// thin bezels, Dynamic Island, side buttons and a real edge thickness in 3D.
const W = 600;
const H = 1254;
const R = 104; // outer corner radius
const BAND = 10; // titanium band seen from the front
const BEZEL = 15; // black glass border around the display
const DEPTH = 22; // edge thickness in px
const SLICES = 11;

const TITANIUM =
  'linear-gradient(135deg, #5d5f63 0%, #d7d8da 16%, #8f9195 34%, #f4f4f5 52%, #7b7d81 74%, #c4c6c9 100%)';
const TITANIUM_EDGE = 'linear-gradient(180deg, #8a8c90 0%, #4d4f53 50%, #8a8c90 100%)';

const ink = '#111B21';
const grey = '#667781';
const accent = '#1DAA61';

const StatusBar: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 92,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 40px 0 62px',
      fontFamily: UI_FONT,
      fontWeight: 600,
      fontSize: 28,
      color: ink,
      zIndex: 5,
    }}
  >
    <span>9:41</span>
    <div style={{display: 'flex', alignItems: 'center', gap: 7, transform: 'scale(0.82)', transformOrigin: 'right center'}}>
      {/* signal */}
      <svg width={34} height={22} viewBox="0 0 34 22">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 9} y={16 - i * 5} width={6} height={6 + i * 5} rx={1.5} fill={ink} />
        ))}
      </svg>
      {/* wifi */}
      <svg width={30} height={22} viewBox="0 0 30 22">
        <path d="M15 21 l-4.5-5 a6.5 6.5 0 0 1 9 0z" fill={ink} />
        <path d="M5.5 11.5 a13.5 13.5 0 0 1 19 0" stroke={ink} strokeWidth={3.2} fill="none" strokeLinecap="round" />
        <path d="M1.5 7 a19.5 19.5 0 0 1 27 0" stroke={ink} strokeWidth={3.2} fill="none" strokeLinecap="round" />
      </svg>
      {/* battery */}
      <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
        <div
          style={{
            width: 46,
            height: 22,
            borderRadius: 7,
            border: `2px solid rgba(17,27,33,0.4)`,
            padding: 2,
          }}
        >
          <div style={{width: '82%', height: '100%', borderRadius: 4, background: ink}} />
        </div>
        <div style={{width: 3, height: 8, borderRadius: 2, background: 'rgba(17,27,33,0.4)'}} />
      </div>
    </div>
  </div>
);

const DynamicIsland: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 22,
      left: '50%',
      marginLeft: -76,
      width: 152,
      height: 46,
      borderRadius: 23,
      background: '#000',
      zIndex: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 18,
    }}
  >
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        background: 'radial-gradient(circle at 35% 35%, #3a4a7a 0%, #10162a 55%, #000 100%)',
        boxShadow: 'inset 0 0 2px rgba(120,140,255,0.4)',
      }}
    />
  </div>
);

const Icon: React.FC<{d: string; size?: number; stroke?: string}> = ({d, size = 40, stroke = accent}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ChatHeader: React.FC = () => (
  <div
    style={{
      paddingTop: 92,
      background: 'rgba(246,246,246,0.97)',
      borderBottom: '1px solid #D9D9D9',
      fontFamily: UI_FONT,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '6px 26px 16px 14px'}}>
      <Icon d="M15 5l-7 7 7 7" size={44} />
      <LogoMark size={62} />
      <div style={{flex: 1}}>
        <div style={{fontWeight: 600, fontSize: 30, color: ink}}>Kopia</div>
        <div style={{fontSize: 22, color: grey}}>en ligne</div>
      </div>
      <Icon d="M15 10l5-3v10l-5-3z M3 7h12v10H3z" size={42} />
      <div style={{width: 12}} />
      <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" size={38} />
    </div>
  </div>
);

const InputBar: React.FC = () => (
  <div
    style={{
      background: 'rgba(246,246,246,0.97)',
      borderTop: '1px solid #D9D9D9',
      padding: '14px 20px 52px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: UI_FONT,
    }}
  >
    <Icon d="M12 5v14M5 12h14" size={42} stroke="#3B4A54" />
    <div
      style={{
        flex: 1,
        height: 56,
        borderRadius: 28,
        background: C.white,
        border: '1px solid #E2E2E2',
        color: '#8696A0',
        fontSize: 26,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
      }}
    >
      Message
    </div>
    <Icon d="M4 8h3l2-3h6l2 3h3v11H4z M12 16a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4" size={40} stroke="#3B4A54" />
    <Icon d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5 11a7 7 0 0 0 14 0 M12 18v3" size={40} stroke="#3B4A54" />
  </div>
);

export const Phone: React.FC<{
  children: React.ReactNode;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  /** 0..1 position of the light sweep across the glass. */
  sheen?: number;
}> = ({children, rotateX = 0, rotateY = 0, rotateZ = 0, sheen = 0.3}) => (
  <div style={{perspective: 2600, width: W, height: H}}>
    <div
      style={{
        position: 'relative',
        width: W,
        height: H,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
      }}
    >
      {/* Edge thickness: stacked slices behind the front face. */}
      {Array.from({length: SLICES}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: R,
            background: TITANIUM_EDGE,
            transform: `translateZ(${-((i + 1) * DEPTH) / SLICES}px)`,
            boxShadow: i === SLICES - 1 ? '0 90px 140px rgba(0,0,0,0.55), 0 30px 50px rgba(0,0,0,0.35)' : undefined,
          }}
        />
      ))}

      {/* Side buttons, set into the edge. */}
      {[
        {side: 'left', top: 236, h: 62},
        {side: 'left', top: 350, h: 112},
        {side: 'left', top: 486, h: 112},
        {side: 'right', top: 380, h: 172},
        {side: 'right', top: 760, h: 96},
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: b.top,
            [b.side]: -5,
            width: 9,
            height: b.h,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #6d6f73, #d4d5d7 50%, #6d6f73)',
            transform: `translateZ(${-DEPTH / 2}px)`,
          }}
        />
      ))}

      {/* Front: titanium band, black bezel, display. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: R,
          background: TITANIUM,
          padding: BAND,
          boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.55), inset 0 0 0 3px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: R - BAND,
            background: '#030303',
            padding: BEZEL,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: R - BAND - BEZEL + 4,
              overflow: 'hidden',
              background: '#EFE7DE',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <StatusBar />
            <DynamicIsland />
            <ChatHeader />
            <div
              style={{
                flex: 1,
                padding: '24px 22px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: 12,
                overflow: 'hidden',
                backgroundColor: '#EFE7DE',
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.045) 2px, transparent 2.5px)',
                backgroundSize: '34px 34px',
              }}
            >
              {children}
            </div>
            <InputBar />
            {/* Home indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: '50%',
                marginLeft: -100,
                width: 200,
                height: 8,
                borderRadius: 4,
                background: ink,
                zIndex: 6,
              }}
            />
            {/* Glass reflection sweep */}
            <div
              style={{
                position: 'absolute',
                top: -200,
                bottom: -200,
                width: 420,
                left: `${-60 + sheen * 160}%`,
                background:
                  'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 45%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%)',
                transform: 'rotate(18deg)',
                zIndex: 7,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Ticks: React.FC = () => (
  <svg width={26} height={16} viewBox="0 0 26 16" style={{marginLeft: 4}}>
    <path d="M1 8.5l4 4 8-9" stroke="#53BDEB" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12.5l1 0 8-9" stroke="#53BDEB" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Bubble: React.FC<{
  out?: boolean;
  t: number; // 0..1 entrance
  time?: string;
  children: React.ReactNode;
}> = ({out, t, time = '10:24', children}) => {
  if (t <= 0) return null;
  return (
    <div
      style={{
        maxHeight: Math.min(1, t * 1.4) * 340,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          alignSelf: out ? 'flex-end' : 'flex-start',
          maxWidth: '84%',
          background: out ? C.bubbleOut : C.white,
          color: ink,
          fontFamily: UI_FONT,
          fontSize: 26,
          lineHeight: 1.35,
          padding: '12px 18px 8px',
          borderRadius: 22,
          borderTopRightRadius: out ? 6 : 22,
          borderTopLeftRadius: out ? 22 : 6,
          boxShadow: '0 1px 1.5px rgba(11,20,26,0.13)',
          opacity: Math.min(1, t * 1.5),
          transform: `translateY(${(1 - t) * 30}px) scale(${0.85 + 0.15 * t})`,
          transformOrigin: out ? 'right bottom' : 'left bottom',
        }}
      >
        {children}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontSize: 18,
            color: grey,
            marginTop: 2,
          }}
        >
          {time}
          {out && <Ticks />}
        </div>
      </div>
    </div>
  );
};
