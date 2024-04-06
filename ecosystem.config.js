module.exports = {
  apps: [
    {
      name: 'my-api-app',
      script: './dist/main.js',
      interpreter: '/root/.nvm/versions/node/v20.9.0/bin/node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
    },
  ],
};
