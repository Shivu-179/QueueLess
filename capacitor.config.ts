import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.queueless.app',
  appName: 'QueueLess',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'http://10.119.2.183:3000',
  },
};

export default config;