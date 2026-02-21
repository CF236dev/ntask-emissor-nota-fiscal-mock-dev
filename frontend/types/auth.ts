export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface PKCEChallenge {
  code_verifier: string;
  code_challenge: string;
}
