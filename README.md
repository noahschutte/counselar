# counselar

Online training platform

https://www.counselar.com

## Product information

- Wireframe: https://projects.invisionapp.com/freehand/document/oliZGY1nr
- Drawio ERD: https://drive.google.com/file/d/19rwwYUjVhEdWp6CGKPl_83fPujucM-G3/view?usp=sharing
- Postman API Documentation: https://documenter.getpostman.com/view/582732/T1Dv9aLw?version=latest

## Tech Stack and Services

- node.js, express, mongoDB, mongoose
- MongoDB hosted on MongoDB Atlas
- TODO: DNS and SSL handled by AWS Route 53
- TODO: CI/CD handled by AWS Amplify
- TODO: Asset storage handled by AWS S3
- TODO: Email development handled by Mailtrap
- TODO: Email client handled by SendGrid
- TODO: Payment handled by Stripe

## Run Application Locally

1. Local dependencies:
   - node version ^14
   - npm version ^6
   - ndb version ^1
   - mongodb
2. `cp example_config.env config.env`
3. Obtain environment variables for config.env
4. `npm start`

### Local Development Tools

- `npm run dev` uses nodemon
- `npm run debug` uses node debugger
- **CAUTION:** `npm run start:prod` connects to production services
- postman
- compass
- VSCode
  - Let me know if you need linter configurations

<!-- ## RESTRICTED: Deploy to Testing Environment

1. Merge to **testing** branch
2. TODO: provide testing url

## RESTRICTED: Deploy to Production Environment

1. Merge to **master** branch
2. TODO: provide production url -->
