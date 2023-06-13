module.exports = {
  apps: [
    {
      name: "Loyalty Staff Portal",
      script: "./bin/www",

      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
