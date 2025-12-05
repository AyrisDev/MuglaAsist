export default ({ config }) => ({
  ...config,
  name: 'Muğla Asist',
  slug: 'mugla-asist',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'mugla',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ayristech.muglaasist',
  },
android: {
  adaptiveIcon: {
    foregroundImage: "./assets/images/icon.png", // Var olan ana ikonunu göster
    backgroundColor: "#ffffffff" // Arka planı renk koduyla hallet (Resim dosyasına gerek yok)
  },
  package: 'com.ayristech.muglaasist',
  versionCode: 1,
  edgeToEdgeEnabled: true,
  predictiveBackGestureEnabled: false,
},
  web: {
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#1a1a1a',
        dark: {
          backgroundColor: '#1a1a1a',
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "9657272f-5ec1-4b76-866d-f14499743337"
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});