
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f4a8c97bd6b44ca3aa3ade048a77a0b1',
  appName: 'rent-room-records',
  webDir: 'dist',
  server: {
    url: 'https://f4a8c97b-d6b4-4ca3-aa3a-de048a77a0b1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // This allows the app to run on Android 11 and higher
  android: {
    allowMixedContent: true
  }
};

export default config;
