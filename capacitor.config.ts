import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.queueless.app',
  appName: 'QueueLess',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'https://queue-less-indol.vercel.app',
  },
};

export default config;