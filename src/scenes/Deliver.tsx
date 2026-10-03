import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT} from '../theme';
import {Caption} from '../components/Caption';

const Printer: React.FC = () => {
  const f = useCurrentFrame();
  const enter = pop(f, 0, 13);
  const pages = Math.floor(range(f, [12, 62], [0, 24]));
  return (
    <div style={{transform: `scale(${enter})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {/* paper tray */}
      <div style={{width: 300, height: 90, background: C.white, borderRadius: '12px 12px 0 0'}} />
      <div
        style={{
          width: 560,
          height: 260,
          borderRadius: 44,
          background: C.inkSoft,
          border: `6px solid #2C3D58`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 50px',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 99,
            background: f % 10 < 5 && pages < 24 ? C.green : '#2C3D58',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 40,
            color: C.yellow,
            fontWeight: 800,
            fontSize: 40,
          }}
        >
          {pages}/24 pages
        </div>
      </div>
      {/* output sheets */}
      <div style={{position: 'relative', width: 360, height: 300}}>
        {Array.from({length: 5}).map((_, i) => {
          const t = range(f, [12 + i * 10, 22 + i * 10], [0, 1]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                top: lerp(t, -260, 20 - i * 6),
                width: 360,
                height: 250,
                background: C.white,
                borderRadius: 8,
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                padding: 30,
                transform: `rotate(${(i % 2 ? 1 : -1) * i * 0.8}deg)`,
                zIndex: 1,
              }}
            >
              {[0.9, 0.7, 0.8, 0.5].map((w, k) => (
                <div
                  key={k}
                  style={{height: 14, width: `${w * 100}%`, background: '#D5DBE5', borderRadius: 7, marginBottom: 18}}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Quadratic bezier from shop to classroom.
const P0 = {x: 170, y: 640};
const P1 = {x: 540, y: 80};
const P2 = {x: 910, y: 640};
const at = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
});

const Place: React.FC<{x: number; y: number; label: string; icon: string; t: number; active?: boolean}> = ({
  x,
  y,
  label,
  icon,
  t,
  active,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 120,
      top: y - 60,
      width: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transform: `scale(${t})`,
    }}
  >
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: 40,
        background: active ? C.green : C.white,
        fontSize: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </div>
    <div style={{color: C.white, fontWeight: 600, fontSize: 34, marginTop: 14}}>{label}</div>
  </div>
);

const Route: React.FC = () => {
  const f = useCurrentFrame();
  const t = range(f, [14, 62], [0, 1]);
  const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  const pos = at(eased);
  const ahead = at(Math.min(1, eased + 0.01));
  const angle = (Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * 180) / Math.PI;
  const d = `M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;
  return (
    <div style={{position: 'relative', width: 1080, height: 900}}>
      <svg width={1080} height={900} style={{position: 'absolute'}}>
        <path d={d} stroke="#2C3D58" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray="2 30" />
        <path
          d={d}
          stroke={C.yellow}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - eased}
        />
      </svg>
      <Place x={P0.x} y={P0.y} label="Boutique" icon="🖨️" t={pop(f, 0)} />
      <Place x={P2.x} y={P2.y} label="Salle B12" icon="🎓" t={pop(f, 6)} active={eased >= 1} />
      <div
        style={{
          position: 'absolute',
          left: pos.x - 70,
          top: pos.y - 120,
          fontSize: 120,
          transform: `rotate(${angle * 0.25}deg) scaleX(-1)`,
          opacity: ease(f, 8, 8),
        }}
      >
        🛵
      </div>
    </div>
  );
};

export const Deliver: React.FC = () => {
  const f = useCurrentFrame();
  const out1 = 1 - ease(f, 70, 10);
  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: FONT, alignItems: 'center'}}>
      <Sequence durationInFrames={82} layout="none">
        <div style={{position: 'absolute', top: 160, width: '100%', opacity: out1}}>
          <Caption step="Étape 3" title="Une boutique partenaire imprime" sub="Près de chez vous, selon votre zone" />
        </div>
        <div style={{position: 'absolute', top: 760, width: '100%', display: 'flex', justifyContent: 'center', opacity: out1}}>
          <Printer />
        </div>
      </Sequence>
      <Sequence from={80} layout="none">
        <div style={{position: 'absolute', top: 160, width: '100%'}}>
          <Caption step="Étape 4" title="Un coursier vérifié vous l'apporte" sub="Jusqu'à votre salle, pour 200 XAF" />
        </div>
        <div style={{position: 'absolute', top: 760}}>
          <Route />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
