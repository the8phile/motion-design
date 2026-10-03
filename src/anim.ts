import {interpolate, spring, Easing} from 'remotion';
import {FPS} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 over [start, start+duration] frames, eased. */
export const ease = (frame: number, start: number, duration = 15) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

/** Springy 0→1 entrance starting at `delay`. */
export const pop = (frame: number, delay = 0, damping = 12) =>
  spring({frame: frame - delay, fps: FPS, config: {damping, mass: 0.6}});

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

export const range = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, clamp);
