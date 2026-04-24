import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iAcores.menu',
  appName: 'menuplusB',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "Camera": {
      "sync": true
    }

  }

};


export default config;
