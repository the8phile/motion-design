import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT, UI_FONT} from '../theme';
import {LogoMark} from '../components/Logo';
import {ScaledPhone} from '../components/Phone';

const URL = 'kopia.online';

/** The kopia.online landing page in a mobile browser, with the address typed in. */
const BrowserScreen: React.FC<{f: number}> = ({f}) => {
  const typed = Math.floor(range(f, [6, 26], [0, URL.length]));
  const load = range(f, [28, 40], [0, 1]);
  const page = ease(f, 32, 16);
  const tap = range(f, [70, 76, 86], [0, 1, 0]);
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', fontFamily: UI_FONT, paddingTop: 92}}>
      {/* page */}
      <div style={{flex: 1, overflow: 'hidden', background: C.white, position: 'relative'}}>
        <div style={{opacity: page, transform: `translateY(${lerp(page, 40, 0)}px)`}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 26px',
              borderBottom: '1px solid #EEE',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <LogoMark size={46} />
              <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.ink}}>KOPIA</span>
            </div>
            <div
              style={{
                background: C.yellow,
                color: C.ink,
                fontWeight: 700,
                fontSize: 20,
                padding: '10px 18px',
                borderRadius: 999,
              }}
            >
              Commander
            </div>
          </div>
          <div style={{background: C.ink, color: C.white, padding: '34px 30px 40px'}}>
            <div
              style={{
                display: 'inline-block',
                border: `1.5px solid ${C.yellow}`,
                color: C.yellow,
                fontSize: 18,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 999,
              }}
            >
              Impression & livraison campus
            </div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.1, marginTop: 18}}>
              Imprimez vos documents
            </div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.1, color: C.yellow}}>
              Livrés jusqu'à votre salle
            </div>
            <div style={{fontSize: 21, lineHeight: 1.5, opacity: 0.8, marginTop: 14}}>
              Envoyez vos fichiers, payez par Mobile Money, un coursier vérifié vous l'apporte.
            </div>
            <div style={{display: 'flex', gap: 14, marginTop: 14, fontSize: 18, color: '#B9C3D3'}}>
              <span>✓ WhatsApp ou web</span>
              <span>✓ MoMo</span>
              <span>✓ Code PIN</span>
            </div>
            <div
              style={{
                marginTop: 24,
                background: C.yellow,
                color: C.ink,
                fontWeight: 700,
                fontSize: 26,
                textAlign: 'center',
                padding: '20px 0',
                borderRadius: 18,
                transform: `scale(${1 - tap * 0.05})`,
                boxShadow: `0 0 0 ${tap * 10}px rgba(255,201,51,0.35)`,
              }}
            >
              Commander maintenant
            </div>
          </div>
          <div style={{padding: '26px 26px 0'}}>
            <div style={{border: '1px solid #E6E8EC', borderRadius: 22, padding: '20px 22px'}}>
              <div style={{fontSize: 18, color: '#667781', fontWeight: 600}}>ESTIMATEUR DE PRIX</div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, marginTop: 12, color: C.ink}}>
                <span>Nombre de pages</span>
                <b>24</b>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, marginTop: 8, color: C.ink}}>
                <span>Livraison en salle</span>
                <b>200 XAF</b>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 28,
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: '1px solid #EEE',
                  color: C.ink,
                  fontWeight: 700,
                }}
              >
                <span>Total estimé</span>
                <span>680 XAF</span>
              </div>
            </div>
          </div>
        </div>
        {/* loading bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 5,
            width: `${load * 100}%`,
            background: '#0A84FF',
            opacity: load < 1 ? 1 : 0,
          }}
        />
      </div>
      {/* bottom address bar, iOS Safari style */}
      <div style={{background: 'rgba(246,246,246,0.97)', borderTop: '1px solid #DDD', padding: '16px 22px 50px'}}>
        <div
          style={{
            height: 60,
            borderRadius: 18,
            background: C.white,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 26,
            color: '#111',
          }}
        >
          <svg width={16} height={20} viewBox="0 0 16 20">
            <rect x={1} y={8} width={14} height={11} rx={2.5} fill="#555" />
            <path d="M4 8V5.5a4 4 0 0 1 8 0V8" stroke="#555" strokeWidth={2.2} fill="none" />
          </svg>
          <span>
            {URL.slice(0, typed)}
            {typed < URL.length && f % 16 < 9 && <span style={{color: '#0A84FF'}}>|</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 0, 11);
  const phone = pop(f, 2, 15);
  const sticker = pop(f, 40, 10);
  const btn = pop(f, 50, 11);
  const pulse = f > 64 ? 1 + Math.sin((f - 64) / 5) * 0.025 : 1;
  const fade = (d: number) => ({
    opacity: ease(f, d, 14),
    transform: `translateY(${lerp(ease(f, d, 14), 30, 0)}px)`,
  });
  return (
    <AbsoluteFill style={{background: C.yellow, fontFamily: FONT, alignItems: 'center', color: C.ink}}>
      <div
        style={{
          position: 'absolute',
          top: 110,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          transform: `scale(${logo})`,
        }}
      >
        <LogoMark size={110} />
        <div style={{fontSize: 100, fontWeight: 800, letterSpacing: 4}}>KOPIA</div>
      </div>

      <div style={{position: 'absolute', top: 300, transform: `translateY(${lerp(phone, 900, 0)}px)`}}>
        <ScaledPhone
          scale={0.74}
          rotateX={lerp(phone, 24, 5) + Math.sin(f / 48) * 1.2}
          rotateY={lerp(phone, -34, -12) + Math.sin(f / 34) * 2}
          rotateZ={lerp(phone, 6, 0)}
          sheen={range(f, [0, 170], [0, 1])}
          screenBg={C.white}
        >
          <BrowserScreen f={f} />
        </ScaledPhone>
        {/* price sticker */}
        <div
          style={{
            position: 'absolute',
            right: -215,
            top: 30,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background: C.ink,
            color: C.yellow,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            transform: `scale(${sticker}) rotate(${lerp(sticker, -40, -10)}deg)`,
          }}
        >
          <div style={{fontSize: 34, fontWeight: 600, color: C.white}}>Dès</div>
          <div style={{fontSize: 92, fontWeight: 800, lineHeight: 1}}>25</div>
          <div style={{fontSize: 34, fontWeight: 800}}>XAF / page</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: C.ink,
            color: C.yellow,
            fontSize: 50,
            fontWeight: 800,
            padding: '30px 60px',
            borderRadius: 999,
            transform: `scale(${btn * pulse})`,
          }}
        >
          Commandez sur kopia.online
        </div>
        <div style={{fontSize: 36, marginTop: 34, ...fade(56)}}>Livraison jusqu'en salle : 200 XAF</div>
        <div style={{display: 'flex', gap: 20, marginTop: 30, ...fade(62)}}>
          {['MTN MoMo', 'Orange Money'].map((m) => (
            <div
              key={m}
              style={{
                border: `4px solid ${C.ink}`,
                borderRadius: 999,
                padding: '10px 30px',
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              {m}
            </div>
          ))}
        </div>
        <div style={{fontSize: 32, marginTop: 34, ...fade(70)}}>
          Parrainez un ami : <b>50 XAF offerts</b> sur sa commande
        </div>
      </div>
    </AbsoluteFill>
  );
};
