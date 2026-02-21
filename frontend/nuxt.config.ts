export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,

  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      idpBaseUrl:
        process.env.NUXT_PUBLIC_IDP_BASE_URL ||
        "https://ntask-idp-dev-backend-la46tdhnda-uc.a.run.app",
      idpFrontendUrl:
        process.env.NUXT_PUBLIC_IDP_FRONTEND_URL ||
        "https://ntask-idp-dev-frontend-la46tdhnda-uc.a.run.app",
      idpClientId:
        process.env.NUXT_PUBLIC_IDP_CLIENT_ID || "emissor-nota-fiscal-client",
      processosUrl:
        process.env.NUXT_PUBLIC_PROCESSOS_URL ||
        "https://ntask-processos-frontend-dev-la46tdhnda-uc.a.run.app",
      devMode: process.env.NUXT_PUBLIC_DEV_MODE === "true",
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "pt-BR" },
      title: "nTask - Emissor de Nota Fiscal",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "nTask - Emissor de Nota Fiscal (Mock)" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: ["~/assets/css/main.css"],

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.ts",
  },

  devServer: {
    port: 5010,
    host: "0.0.0.0",
  },
});
