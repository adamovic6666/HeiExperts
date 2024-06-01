module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'VDGPu3Jhz5cJaa440und+u7sZMh793sIfPqtQZYnVd4='),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'dd86031d7fb7a4be78a95036783f8508'),
  },
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
});
