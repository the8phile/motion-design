import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Poppins (SIL Open Font License), bundled in public/fonts so renders work offline.
export const FONT = 'Poppins';
for (const weight of ['400', '600', '800']) {
  loadFont({family: FONT, url: staticFile(`fonts/Poppins-${weight}.woff2`), weight});
}
export const C = {
  ink: '#0E1A2B',
  inkSoft: '#1B2B44',
  cream: '#FFF8EC',
  yellow: '#FFC933',
  green: '#12A150',
  red: '#E8433A',
  white: '#FFFFFF',
  muted: '#8A97AB',
  chatBg: '#ECE5DD',
  bubbleOut: '#D9FDD3',
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
