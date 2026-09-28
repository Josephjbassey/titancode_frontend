/**
 * Subdomain routing configuration & helper utilities for TitanCode Technologies
 * 
 * Supports:
 * - Production:
 *   - Marketing: titancode.tech (or www.titancode.tech)
 *   - App (Auth + Workspace): app.titancode.tech
 * - Local Development:
 *   - Unified mode (default on localhost:3000): all views accessible in one app
 *   - Local subdomain testing (e.g., app.localhost:3000)
 */

export interface SubdomainConfig {
  /** Whether subdomain separation is enforced */
  enabled: boolean;
  /** Subdomain prefix for auth and workspace (default: 'app') */
  appSubdomain: string;
  /** Apex or base domain (e.g. 'titancode.tech') */
  rootDomain: string;
}

/**
 * Returns the current subdomain configuration loaded from environment or defaults.
 */
export function getSubdomainConfig(): SubdomainConfig {
  const envEnabled = import.meta.env.VITE_ENABLE_SUBDOMAIN_ROUTING;
  const isEnabled = envEnabled === 'true' || envEnabled === '1';

  return {
    enabled: isEnabled,
    appSubdomain: import.meta.env.VITE_APP_SUBDOMAIN || 'app',
    rootDomain: import.meta.env.VITE_ROOT_DOMAIN || 'titancode.tech',
  };
}

/**
 * Checks if the current browser session is running on the app subdomain (e.g. app.titancode.tech or app.localhost).
 */
export function isAppSubdomain(): boolean {
  const hostname = window.location.hostname.toLowerCase();
  const { enabled, appSubdomain } = getSubdomainConfig();

  // If running directly on an app.* hostname (e.g. app.titancode.tech or app.localhost)
  if (hostname.startsWith(`${appSubdomain.toLowerCase()}.`)) {
    return true;
  }

  // If subdomain routing is not enabled and hostname is standard localhost / apex, return false
  if (!enabled) {
    return false;
  }

  return false;
}

/**
 * Constructs the target URL for navigating to the App Subdomain (Auth + Workspace).
 * In development without custom domains, falls back safely to in-app routes.
 */
export function getAppUrl(screen: string = 'sign_in'): string {
  const { enabled, appSubdomain, rootDomain } = getSubdomainConfig();
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';

  // Local development
  if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
    if (enabled) {
      return `${protocol}//${appSubdomain}.localhost${port}/#${screen}`;
    }
    return `/#${screen}`;
  }

  // Production or Staging
  return `${protocol}//${appSubdomain}.${rootDomain}/#${screen}`;
}

/**
 * Constructs the target URL for navigating to the Public Marketing site.
 */
export function getMarketingUrl(screen: string = 'home'): string {
  const { enabled, rootDomain } = getSubdomainConfig();
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';

  // Local development
  if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
    if (enabled) {
      return `${protocol}//localhost${port}/#${screen}`;
    }
    return `/#${screen}`;
  }

  // Production or Staging
  return `${protocol}//${rootDomain}/#${screen}`;
}

/**
 * Redirects the browser to the app subdomain if currently on marketing or vice versa.
 */
export function redirectToApp(screen: string = 'sign_in'): void {
  window.location.href = getAppUrl(screen);
}

export function redirectToMarketing(screen: string = 'home'): void {
  window.location.href = getMarketingUrl(screen);
}
