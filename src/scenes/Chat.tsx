import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ease, lerp, pop, range} from '../anim';
import {C, FONT, UI_FONT} from '../theme';
import {Caption} from '../components/Caption';
import {Bubble, ChatScreen, Phone} from '../components/Phone';

const PayButton: React.FC<{label: string; bg: string; fg: string; pressed: number}> = ({
  label,
  bg,
  fg,
  pressed,
}) => (
  <div
    style={{
      flex: 1,
      background: bg,
      color: fg,
      fontFamily: UI_FONT,
      fontWeight: 700,
      fontSize: 24,
      textAlign: 'center',
      padding: '14px 8px',
      borderRadius: 16,
      transform: `scale(${1 - pressed * 0.08})`,
      boxShadow: pressed > 0 ? `0 0 0 ${pressed * 6}px rgba(255,201,51,0.5)` : 'none',
    }}
  >
    {label}
  </div>
);

export const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ease(f, 0, 22);
  const b = (start: number) => pop(f, start, 14);
  const press = range(f, [168, 174, 182], [0, 1, 0]);
  const cap1Out = 1 - ease(f, 112, 10);

  // 3D camera move: swing in, idle drift, small turn when step 2 starts.
  const swing = pop(f, 0, 16);
  const turn = ease(f, 118, 30);
  const rotY = lerp(swing, -38, -12) + turn * 20 + Math.sin(f / 38) * 2.5;
  const rotX = lerp(swing, 28, 7) + Math.sin(f / 52) * 1.5;
  const rotZ = lerp(swing, 8, 0);
  const sheen = range(f, [0, 240], [0, 1]);

  return (
    <AbsoluteFill style={{background: C.ink, fontFamily: FONT, alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 120, width: '100%'}}>
        <Sequence durationInFrames={122} layout="none">
          <div style={{opacity: cap1Out}}>
            <Caption step="Étape 1" title="Envoyez votre fichier" sub="PDF, Word ou photo, depuis votre téléphone" />
          </div>
        </Sequence>
        <Sequence from={122} layout="none">
          <Caption step="Étape 2" title="Payez par Mobile Money" sub="Le devis s'affiche avant de payer" />
        </Sequence>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 540,
          transform: `translateY(${lerp(enter, 1000, 0)}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -140,
            top: 180,
            width: 880,
            height: 880,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(255,201,51,0.22) 0%, rgba(255,201,51,0) 65%)',
          }}
        />
        <Phone rotateX={rotX} rotateY={rotY} rotateZ={rotZ} sheen={sheen}>
          <ChatScreen>
          <Bubble t={b(14)}>Bienvenue sur Kopia 👋 Quelle est votre zone de campus ?</Bubble>
          <Bubble out t={b(32)}>Molyko</Bubble>
          <Bubble t={b(48)}>Envoyez votre fichier (PDF, Word ou photo)</Bubble>
          <Bubble out t={b(66)}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div
                style={{
                  width: 64,
                  height: 78,
                  borderRadius: 10,
                  background: C.red,
                  color: C.white,
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                PDF
              </div>
              <div>
                <div style={{fontWeight: 600}}>cours-droit.pdf</div>
                <div style={{fontSize: 21, color: '#667781'}}>24 pages · 1,2 Mo</div>
              </div>
            </div>
          </Bubble>
          <Bubble t={b(92)}>
            <div style={{fontSize: 21, color: '#667781'}}>24 p. · recto-verso · livraison en salle</div>
            <div style={{fontWeight: 700, fontSize: 36}}>Total : 680 XAF</div>
          </Bubble>
          <Bubble t={b(134)}>
            <div style={{marginBottom: 12}}>Payez en toute sécurité 🔒</div>
            <div style={{display: 'flex', gap: 12}}>
              <PayButton label="MTN MoMo" bg={C.yellow} fg={C.ink} pressed={press} />
              <PayButton label="Orange Money" bg="#FF7900" fg={C.white} pressed={0} />
            </div>
          </Bubble>
          <Bubble t={b(190)}>
            <span style={{color: C.green, fontWeight: 700}}>✓ Paiement reçu : 680 XAF</span>
          </Bubble>
          </ChatScreen>
        </Phone>
      </div>
    </AbsoluteFill>
  );
};
