import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.93d6976c079a4f12b8b9bca0616696e5',
  appName: 'redcoach-mobile',
  webDir: 'dist',
  server: {
    url: 'https://93d6976c-079a-4f12-b8b9-bca0616696e5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;