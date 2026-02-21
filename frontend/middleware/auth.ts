export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const isPublicPath = to.path === "/login" || to.path.startsWith("/auth/");

  if (isPublicPath) {
    return;
  }

  if (config.public.devMode && import.meta.dev) {
    if (!authStore.isAuthenticated) {
      authStore.setDevUser();
    }
    return;
  }

  if (!authStore.isAuthenticated) {
    const isAuth = await authStore.checkAuth();
    if (!isAuth) {
      return navigateTo({
        path: "/auth/redirecting",
        query: { returnTo: to.fullPath },
      });
    }
  }
});
