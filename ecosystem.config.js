module.exports = {
  apps : [{
    script: './server.js',
    env : {
      'PORT': 4000,
      'NODE_ENV' : 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : ['92.118.150.71'],
      ref  : 'origin/main',
      repo : 'https://github.com/alesikivan/data-analytics-server',
      path : '/root/apps/digital-city',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 delete server && pm2 start server.js && pm2 save --force',
      'pre-setup': ''
    }
  }
};
