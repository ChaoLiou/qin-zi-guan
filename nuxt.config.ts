// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
        },
      ],
    },
  },
  css: ["@/assets/css/main.css"],
  modules: ["@varlet/nuxt", "@nuxtjs/google-fonts", "@nuxtjs/tailwindcss"],
  googleFonts: {
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
    display: "swap",
  },
  routeRules: {
    // prerender index route by default
    "/": { prerender: true },
  },
});
