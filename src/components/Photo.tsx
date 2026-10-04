import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

/** Full-bleed blurred, darkened copy of a photo, used behind a sharp photo card. */
export const PhotoBackdrop: React.FC<{src: string; zoom: number; tint?: string}> = ({
  src,
  zoom,
  tint = 'rgba(14,26,43,0.62)',
}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Img
      src={staticFile(src)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(28px) saturate(1.1)',
        transform: `scale(${1.25 * zoom})`,
      }}
    />
    <AbsoluteFill style={{background: tint}} />
  </AbsoluteFill>
);

/** Sharp rounded photo with a slow zoom ("Ken Burns") inside its frame. */
export const PhotoCard: React.FC<{
  src: string;
  width: number;
  height: number;
  zoom: number;
  focus?: string; // CSS object-position
  style?: React.CSSProperties;
}> = ({src, width, height, zoom, focus = 'center', style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 40,
      overflow: 'hidden',
      boxShadow: '0 50px 100px rgba(0,0,0,0.45)',
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: focus,
        transform: `scale(${zoom})`,
        transformOrigin: focus,
      }}
    />
  </div>
);
