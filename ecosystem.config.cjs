module.exports = {
  apps: [
    {
      name: 'data-analytics-server',
      script: './server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ],

  deploy: {
    production: {
      user: 'ialesik',
      host: ['mda.math.muni.cz'],
      ref: 'origin/main',
      repo: 'https://github.com/alesikivan/data-analytics-server',
      path: '/home/ialesik/apps/digital-city',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 delete data-analytics-server && pm2 start server.js --name "data-analytics-server" && pm2 save --force',
      'pre-setup': ''
    }
  }
}
