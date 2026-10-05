import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setEntryPoint('src/index.ts');
Config.setCodec('h264');
// Standard-range 4:2:0 colour plays correctly on every phone and in WhatsApp
// (JPEG frames otherwise produce full-range yuvj420p).
Config.setPixelFormat('yuv420p');
Config.setJpegQuality(95);
// The video is encoded in the "pre-stitcher" pass. Convert the full-range JPEG
// frames to standard range and put a keyframe every second (smooth playback and
// scrubbing on phones).
Config.overrideFfmpegCommand(({type, args}) => {
  if (type !== 'pre-stitcher') return args;
  const out = args.indexOf('-y');
  return [
    ...args.slice(0, out),
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p',
    '-color_range', 'tv',
    '-g', '30',
    '-keyint_min', '30',
    '-sc_threshold', '0',
    ...args.slice(out),
  ];
});
// Uncomment to use a locally installed Chromium instead of Remotion's download:
// Config.setBrowserExecutable('/path/to/chromium');
