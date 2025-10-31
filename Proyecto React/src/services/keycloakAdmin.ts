
import axios from 'axios';
import { KEYCLOAK_BASE_URL, MASTER_REALM, ADMIN_CLIENT_ID, ADMIN_USERNAME, ADMIN_PASSWORD, APP_REALM, normalizeBaseUrl } from '../config';

const base = normalizeBaseUrl(KEYCLOAK_BASE_URL);

const http = axios.create({
  baseURL: base,
});

export async function getAdminToken() {
  const url = `/realms/${MASTER_REALM}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', ADMIN_CLIENT_ID);
  params.append('username', ADMIN_USERNAME);
  params.append('password', ADMIN_PASSWORD);
  const { data } = await http.post(url, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data?.access_token as string;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function createUser(token: string, user: {username: string; email?: string; enabled?: boolean; firstName?: string; lastName?: string;}) {
  const url = `/admin/realms/${APP_REALM}/users`;
  const { status, headers } = await http.post(url, user, { headers: { ...authHeader(token), 'Content-Type': 'application/json' }});
  if (status !== 201) throw new Error('Unexpected status ' + status);
  const location = headers['location'] || headers['Location'];
  // location sample: http://.../users/{id}
  const id = location ? String(location).split('/').pop() : undefined;
  return { id, location };
}

export async function listUsers(token: string, query?: {username?: string; email?: string; first?: number; max?: number;}) {
  const url = `/admin/realms/${APP_REALM}/users`;
  const { data } = await http.get(url, { params: query, headers: { ...authHeader(token) } });
  return data as Array<any>;
}

export async function setUserPassword(token: string, userId: string, value: string, temporary = false) {
  const url = `/admin/realms/${APP_REALM}/users/${userId}/reset-password`;
  await http.put(url, { type: 'password', value, temporary }, { headers: { ...authHeader(token), 'Content-Type': 'application/json' }});
}

export async function updateUser(token: string, userId: string, body: any) {
  const url = `/admin/realms/${APP_REALM}/users/${userId}`;
  await http.put(url, body, { headers: { ...authHeader(token), 'Content-Type': 'application/json' }});
}

export async function getRealmRole(token: string, roleName: string) {
  const url = `/admin/realms/${APP_REALM}/roles/${encodeURIComponent(roleName)}`;
  const { data } = await http.get(url, { headers: { ...authHeader(token) }});
  return data as { id: string; name: string; description?: string };
}

export async function assignRealmRoleToUser(token: string, userId: string, role: { id: string; name: string; }) {
  const url = `/admin/realms/${APP_REALM}/users/${userId}/role-mappings/realm`;
  await http.post(url, [role], { headers: { ...authHeader(token), 'Content-Type': 'application/json' }});
}

export async function createGroup(token: string, name: string) {
  const url = `/admin/realms/${APP_REALM}/groups`;
  const { status, headers } = await http.post(url, { name }, { headers: { ...authHeader(token), 'Content-Type': 'application/json' }});
  if (status !== 201) throw new Error('Unexpected status ' + status);
  const location = headers['location'] || headers['Location'];
  const id = location ? String(location).split('/').pop() : undefined;
  return { id, location };
}

export async function addUserToGroup(token: string, userId: string, groupId: string) {
  const url = `/admin/realms/${APP_REALM}/users/${userId}/groups/${groupId}`;
  await http.put(url, undefined, { headers: { ...authHeader(token) }});
}

// User OIDC (resource owner password for lab only)
export async function loginUserROPC(username: string, password: string, scopes = 'openid profile email') {
  const url = `/realms/${APP_REALM}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', (global as any).PUBLIC_CLIENT_ID || 'ventas-web');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', scopes);
  const { data } = await http.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  return data as any;
}

export async function userInfo(accessToken: string) {
  const url = `/realms/${APP_REALM}/protocol/openid-connect/userinfo`;
  const { data } = await http.get(url, { headers: { ...authHeader(accessToken) }});
  return data;
}

export async function logout(refreshToken: string, clientId?: string) {
  const url = `/realms/${APP_REALM}/protocol/openid-connect/logout`;
  const params = new URLSearchParams();
  params.append('client_id', clientId || (global as any).PUBLIC_CLIENT_ID || 'ventas-web');
  params.append('refresh_token', refreshToken);
  await http.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
}
