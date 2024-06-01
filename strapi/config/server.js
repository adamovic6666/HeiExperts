module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("ADMIN_DASHBOARD_URL"),
  app: {
    keys: env.array("APP_KEYS", ["j7wUy/dOhsRajxNAJQd8dg==", "jbF2c5kBqJ84bN+SHbWVHA=="]),
  },
});
