import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.lovable.fb91051d9e4d4510aeeb63638d3a9575',
  appName: 'Wallet Dashboard',
  webDir: 'dist',
  plugins: {
    App: {
      url: 'fingerpay://'
    }
  }
};

export default config;