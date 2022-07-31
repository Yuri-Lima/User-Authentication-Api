[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)


# Authentication REST API with Node.js, TypeScript, Typegoose, Zod and Docker/Compose
### This is my personal version - [Yuri Lima]
#### The main propose for that copy is for learnings
* [ Thanks to Tom Does Tech ]

## Features
1. Register a user
2. Verify user's email address
3. Send forgot password email
4. Reset password
5. Get current user
6. Login
7. Access token
8. Refresh tokens

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