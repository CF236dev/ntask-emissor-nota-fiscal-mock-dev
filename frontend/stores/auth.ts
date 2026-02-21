import { defineStore } from "pinia";
import type { User } from "~/types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
  }),

  actions: {
    setAuth(user: User, accessToken: string) {
      this.user = user;
      this.accessToken = accessToken;
      this.isAuthenticated = true;

      const isSecure =
        process.env.NODE_ENV === "production" ||
        (typeof window !== "undefined" && window.location.protocol === "https:");
      const tokenCookie = useCookie("access_token", {
        maxAge: 60 * 60,
        sameSite: "lax",
        secure: isSecure,
      });
      tokenCookie.value = accessToken;
    },

    clearAuth() {
      this.user = null;
      this.accessToken = null;
      this.isAuthenticated = false;
      const tokenCookie = useCookie("access_token");
      tokenCookie.value = null;
    },

    async checkAuth(): Promise<boolean> {
      const tokenCookie = useCookie("access_token");
      if (!tokenCookie.value) {
        this.clearAuth();
        return false;
      }
      this.accessToken = tokenCookie.value;
      try {
        const auth = useAuth();
        const user = await auth.fetchUserInfo(tokenCookie.value);
        this.user = user;
        this.isAuthenticated = true;
        return true;
      } catch {
        this.clearAuth();
        return false;
      }
    },

    setDevUser() {
      this.user = {
        id: "1",
        name: "Dev User",
        email: "dev@ntask.app",
      };
      this.accessToken = "dev-token";
      this.isAuthenticated = true;
    },
  },
});
