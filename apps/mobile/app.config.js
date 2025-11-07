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
    bundleIdentifier: 'com.mugla.asist',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#1a1a1a',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    package: 'com.mugla.asist',
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
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
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
