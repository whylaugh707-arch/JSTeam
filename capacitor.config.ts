import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jstosint.app',
  appName: 'JST-OSINT V.1',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false
  }
};

export default config;
