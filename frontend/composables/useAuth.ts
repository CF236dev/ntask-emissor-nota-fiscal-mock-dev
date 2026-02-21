import type { PKCEChallenge, TokenResponse, User } from "~/types/auth";

function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  bytes.forEach((byte) => (str += String.fromCharCode(byte)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  return await crypto.subtle.digest("SHA-256", encoder.encode(plain));
}

function generateRandomString(length: number): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(randomValues)
    .map((v) => charset[v % charset.length])
    .join("");
}

const STATE_PREFIX = "ntask_";

function encodeStatePayload(returnTo: string, nonce: string): string {
  const payload = JSON.stringify({ returnTo, nonce });
  const base64 = btoa(
    unescape(encodeURIComponent(payload))
  ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return STATE_PREFIX + base64;
}

function decodeStatePayload(
  state: string
): { returnTo: string; nonce: string } | null {
  if (!state || !state.startsWith(STATE_PREFIX)) return null;
  try {
    const base64 = state
      .slice(STATE_PREFIX.length)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payload = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(payload) as { returnTo: string; nonce: string };
  } catch {
    return null;
  }
}

export function isSafeReturnTo(path: string): boolean {
  if (!path || typeof path !== "string") return false;
  const trimmed = path.trim();
  if (trimmed === "" || trimmed === "/") return true;
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.includes("://")) return false;
  return true;
}

export const useAuth = () => {
  const config = useRuntimeConfig();
  const idpBaseUrl = config.public.idpBaseUrl;
  const clientId = config.public.idpClientId;

  const generatePKCEChallenge = async (): Promise<PKCEChallenge> => {
    const codeVerifier = generateRandomString(64);
    const hash = await sha256(codeVerifier);
    const codeChallenge = base64URLEncode(hash);
    return { code_verifier: codeVerifier, code_challenge: codeChallenge };
  };

  const initiateLogin = async (returnTo?: string) => {
    const pkce = await generatePKCEChallenge();
    sessionStorage.setItem("pkce_verifier", pkce.code_verifier);

    const safeReturnTo =
      returnTo && isSafeReturnTo(returnTo) ? returnTo : "/";
    const nonce = generateRandomString(32);
    const state = encodeStatePayload(safeReturnTo, nonce);
    sessionStorage.setItem("oauth_state", state);

    const redirectUri = `${window.location.origin}/auth/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "openid profile email",
      state,
      code_challenge: pkce.code_challenge,
      code_challenge_method: "S256",
    });

    window.location.href = `${idpBaseUrl}/api/oauth/authorize?${params.toString()}`;
  };

  const handleCallback = async (
    code: string,
    state: string
  ): Promise<TokenResponse> => {
    const storedState = sessionStorage.getItem("oauth_state");
    if (!state || state !== storedState) {
      throw new Error("Estado OAuth inválido");
    }

    const codeVerifier = sessionStorage.getItem("pkce_verifier");
    if (!codeVerifier) {
      throw new Error("Verificador PKCE não encontrado");
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    const response = await fetch(`${idpBaseUrl}/api/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || error.error_description || "Erro ao trocar código por token"
      );
    }

    const tokenData: TokenResponse = await response.json();
    sessionStorage.removeItem("pkce_verifier");
    sessionStorage.removeItem("oauth_state");
    return tokenData;
  };

  const fetchUserInfo = async (accessToken: string): Promise<User> => {
    const response = await fetch(`${idpBaseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar informações do usuário");
    }
    return await response.json();
  };

  const clearAuthData = () => {
    const authStore = useAuthStore();
    authStore.clearAuth();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("pkce_verifier");
      sessionStorage.removeItem("oauth_state");
    }
  };

  const logout = async () => {
    const token = useCookie("access_token");
    const origin = window.location.origin;
    const IDP_LEGACY_FRONTEND_HOST = "idp.ntask.app";

    try {
      const url = `${idpBaseUrl}/api/auth/logout`;
      const isLegacyFrontend =
        typeof idpBaseUrl === "string" &&
        (url.startsWith(`http://${IDP_LEGACY_FRONTEND_HOST}`) ||
          url.startsWith(`https://${IDP_LEGACY_FRONTEND_HOST}`));
      if (!isLegacyFrontend) {
        await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token.value}` },
        });
      }
    } catch (e) {
      console.warn("Erro no logout:", e);
    }

    clearAuthData();

    const isLegacyFrontendRedirect =
      typeof idpBaseUrl === "string" &&
      (idpBaseUrl.startsWith(`http://${IDP_LEGACY_FRONTEND_HOST}`) ||
        idpBaseUrl.startsWith(`https://${IDP_LEGACY_FRONTEND_HOST}`));
    if (isLegacyFrontendRedirect) {
      window.location.href = origin;
      return;
    }
    window.location.href = `${idpBaseUrl}/logout?redirect=${encodeURIComponent(origin)}`;
  };

  const getReturnToFromState = (state: string): string => {
    const payload = decodeStatePayload(state);
    if (!payload) return "/";
    return isSafeReturnTo(payload.returnTo) ? payload.returnTo : "/";
  };

  return {
    initiateLogin,
    handleCallback,
    fetchUserInfo,
    logout,
    clearAuthData,
    generatePKCEChallenge,
    getReturnToFromState,
  };
};
