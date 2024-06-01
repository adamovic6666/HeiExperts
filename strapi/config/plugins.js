module.exports = ({ env }) => ({
  graphql: {
    enabled: true,
    config: {
      subscriptions: false,
      shadowCRUD: false,
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env(
        "JWT_SECRET",
        "FLhrePTwXom6mVKIII+KX+IjYTU49xNwnznhT5HFPFg="
      ),
    },
  },
  "config-sync": {
    enabled: true,
  },
  email: {
    config: {
      provider: "strapi-provider-email-smtp",
      providerOptions: {
        host: env("SMTP_HOST"),
        port: 1025,
        // secure: false,
        // auth: {
        //   user: env("SMTP_USERNAME"),
        //   pass: env("SMTP_PASSWORD"),
        // },
        username: env("SMTP_USERNAME"),
        password: env("SMTP_PASSWORD"),
        // rejectUnauthorized: true,
        // requireTLS: true,
        // connectionTimeout: 1,
      },
      settings: {
        defaultFrom: "noreply@example.com",
        defaultReplyTo: "noreply@example.com",
      },
    },
  },
});
