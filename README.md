# Data analytics server

## Development server

You need to create a `default.json` in `config` folder.
Inside `default.json` you need to put: 
```js
  {
    "APP": {
      "PORT": "4000",
      "JWT_SECRET_KEY": "JWT_SECRET_KEY",
      "HUBSPOT_API_KEY": "HUBSPOT_API_KEY"
    },
    "MAIL": {
      "SMTP_HOST": "test@gmail.com",
      "SMTP_PORT": "SMTP_PORT",
      "SMTP_EMAIL": "test@gmail.com",
      "SMTP_PASSWORD": "SMTP_PASSWORD",
      "DESTINATION": "test@gmail.com"
    },
    "ADMIN": {
      "LOGIN": "admin",
      "PASSWORD": "123456"
    }
  }
```

Inside `languages` folder you need to create two files: `en.json` and `cs.json` with translation.

Run `npm start` for a dev server. 
Navigate to `http://localhost:4000`.
