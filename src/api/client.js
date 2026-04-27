// src/api/client.js
export const BASE_URL = 'https://afia-bridge-doctor-1.onrender.com/api/v1'

// Called by AuthContext to register a logout handler.
// This avoids a circular import (client.js → AuthContext → client.js).
let _onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn
}

export async function apiClient(endpoint, { token, method = 'GET', body, skipAuthCheck = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  console.log(res)

  // Get response data
  const contentType = res.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text()

  // Handle 401 responses - just throw the error from backend
  if (res.status === 401) {
    const errorMessage = typeof data === 'object'
      ? (data?.message ?? data?.error ?? 'Authentication failed')
      : data
    
    // For protected endpoints (non-auth), trigger logout
    const isAuthEndpoint = endpoint.includes('/auth/login') || 
                          endpoint.includes('/auth/register') ||
                          endpoint.includes('/auth/verify')
    
    if (!isAuthEndpoint && !skipAuthCheck && _onUnauthorized) {
      _onUnauthorized() // This will clear token and redirect to login
    }
    
    // Always throw the actual error message from backend
    throw new Error(errorMessage)
  }

  if (!res.ok) {
    const message = typeof data === 'object'
      ? (data?.message ?? data?.error ?? `Request failed: ${res.status}`)
      : data
    throw new Error(message)
  }

  return data
}