import React from 'react';
import {C, FONT} from '../theme';

export const LogoMark: React.FC<{size?: number; bg?: string; fg?: string}> = ({
  size = 120,
  bg = C.ink,
  fg = C.yellow,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: bg,
      color: fg,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size * 0.62,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1,
    }}
  >
    K
  </div>
);
