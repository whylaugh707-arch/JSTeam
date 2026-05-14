import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whylaugh404.app',
  appName: 'WhyLaugh404',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
