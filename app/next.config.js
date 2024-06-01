/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    additionalData: `@import "./styles/variables.scss"; @import "./styles/breakpoints.scss";`,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_STRAPI_URL.replace("https://", "")],
  },
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    localeDetection: false,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
};
