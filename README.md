[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)


# Authentication REST API with Node.js, TypeScript, Typegoose, Zod and Docker/Compose
### This is my personal version - [Yuri Lima]
#### The main propose for that copy is for learnings
* [ Thanks to Tom Does Tech ](https://youtu.be/qylGaki0JhY?list=PL4vok-JSscqB9ChEMdwLSARkaSM_DaO4w)

## Corrections
* [ ] 1.1.1 - 2021-08-01 - 00:00:00 - [Yuri Lima] - Fixing the README.md file
Fix the Page Not Found Error


## Features
1. Register a user
2. Verify user's email address
3. Send forgot password email
4. Reset password
5. Get current user
6. Login
7. Access token
8. Refresh tokens

## Headers
1. Content-Type: application/json [ONLY]

## Auth Users Endpoint
1. POST /api/users/register
    1. Register a user BODY
       1. fisrtName - required
       2. middleName - optional
       3. lastName - required
       4. nickName - optional
       5. password - required
       6. passwordConfirmation - required
       7. email - required
2. POST /api/users/verify/:id/:verificationCode
   1. Verify user's id PARAMS
      1. id - required
      2. verificationCode - required
3. POST /api/users/forgot-password
   1.  Send forgot password email BODY
       1. email - required
4. POST /api/users/reset-password/:id/:resetPasswordCode
   1. Reset password PARAMS
      1. id - required
      2. resetCode - required
   2. Reset password BODY
      1. password - required
      2. passwordConfirmation - required
5. POST /api/users/me
   1. Get current user
      1. Authorization - required
## Auth Sessions Endpoint
1. POST /api/sessions
   1. Login BODY
      1. email - required
      2. password - required
2. POST /api/sessions/refresh
   1. Refresh tokens BODY
      1. refreshToken - required
## Health Check Endpoint
   1. GET /api/health-check
      1. Health check
      
## Following the **request** flow files structure
   1. Routes - routes.ts __[The request comes from the route and call the controllers]__
   2. Controllers - controllers.ts __[The controller the schema then goes to the services]__
   3. Services/Schema - services.ts and schema.ts __[The services calls the model]__
   4. Models - models.ts __[The models gives a feedback to the request with a response]__
```
├── request
│   ├── routes
│   │   ├── controllers
│   │   │   ├── services/schema
│   │   │   │   ├── models
```

## What technology are we using?
- [TypeScript](https://www.typescriptlang.org/) - Static tye checking 
- [Express@5](https://expressjs.com/en/5x/api.html) - Web server
- [Typegoose](https://typegoose.github.io/typegoose/) - Mongoose wrapper for creating TypeScript interfaces and models
- [argon2](https://github.com/ranisalt/node-argon2#readme) - Password hashing
- [Zod](https://github.com/colinhacks/zod) - Validation
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Signing and verifying JSON web tokens
- [Nodemailer](https://nodemailer.com/about/) - Sending emails
- [Pino](https://github.com/pinojs/pino) - Logging
- [config](https://github.com/lorenwest/node-config) - Managing configuration


## What will you need to follow along?
- [Postman](https://www.postman.com/downloads/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Video structure
1. Demo
2. Code walk-through
3. Bootstrap application
4. User API
    1. Create user
    2. Verify user
    3. Request reset password code
    4. Reset password
    5. Get current user
5. Authentication API
    1. Create user session
    2. Get new access token with refresh tokens