import React from 'react';
import {Composition} from 'remotion';
import {AD_DURATION, KopiaAd} from './KopiaAd';
import {FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="KopiaAdVertical"
    component={KopiaAd}
    durationInFrames={AD_DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
