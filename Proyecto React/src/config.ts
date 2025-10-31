
import Constants from 'expo-constants';

export const KEYCLOAK_BASE_URL = (Constants?.expoConfig?.extra as any)?.KEYCLOAK_BASE_URL || 'http://localhost:8080';
export const MASTER_REALM = 'master';
export const ADMIN_CLIENT_ID = 'admin-cli';
export const ADMIN_USERNAME = (Constants?.expoConfig?.extra as any)?.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = (Constants?.expoConfig?.extra as any)?.ADMIN_PASSWORD || 'admin123';

export const APP_REALM = (Constants?.expoConfig?.extra as any)?.APP_REALM || 'ventas-realm';
export const PUBLIC_CLIENT_ID = (Constants?.expoConfig?.extra as any)?.PUBLIC_CLIENT_ID || 'ventas-web';

// Helpers for Android emulator / device:
export const normalizeBaseUrl = (url: string) => {
  // If running on Android emulator, 10.0.2.2 maps to host machine's localhost
  if (url.startsWith('http://localhost')) return url.replace('http://localhost', 'http://10.0.2.2');
  if (url.startsWith('http://127.0.0.1')) return url.replace('http://127.0.0.1', 'http://10.0.2.2');
  return url;
};
