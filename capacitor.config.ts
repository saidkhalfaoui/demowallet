import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.lovable.fb91051d9e4d4510aeeb63638d3a9575',
  appName: 'Wallet Dashboard',
  webDir: 'dist',
  server: {
    url: 'https://fb91051d-9e4d-4510-aeeb-63638d3a9575.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    App: {
      url: 'fingerpay://'
    }
  }
};

export default config;