import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setEntryPoint('src/index.ts');
Config.setCodec('h264');
// Uncomment to use a locally installed Chromium instead of Remotion's download:
// Config.setBrowserExecutable('/path/to/chromium');
