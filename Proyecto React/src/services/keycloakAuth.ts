
import axios from 'axios';
import { KEYCLOAK_BASE_URL, APP_REALM, PUBLIC_CLIENT_ID, normalizeBaseUrl } from '../config';

const base = normalizeBaseUrl(KEYCLOAK_BASE_URL);
const http = axios.create({ baseURL: base });

export async function passwordGrant(username: string, password: string, scopes = 'openid profile email') {
  const url = `/realms/${APP_REALM}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', PUBLIC_CLIENT_ID);
  params.append('username', username);
  params.append('password', password);
  params.append('scope', scopes);
  const { data } = await http.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
  return data as { access_token: string; refresh_token: string; id_token?: string; };
}

export async function getUserInfo(accessToken: string) {
  const url = `/realms/${APP_REALM}/protocol/openid-connect/userinfo`;
  const { data } = await http.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  return data;
}

export async function revoke(refreshToken: string) {
  const url = `/realms/${APP_REALM}/protocol/openid-connect/logout`;
  const params = new URLSearchParams();
  params.append('client_id', PUBLIC_CLIENT_ID);
  params.append('refresh_token', refreshToken);
  await http.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
}
