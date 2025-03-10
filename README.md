## Getting Started
Add a `.env` file with the following keys:
1. `CONNECTION_STRING` - Connection to the database
2. `TOKEN_SECRET_KEY` - Secret key for JSON Web Token - Execute this in your terminal: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

To start the development server, run:
`yarn watch & yarn dev`


## Inspired By
This code is inspired by: [apollo-graphql](https://github.com/mertakpinar29/apollo-graphql)

## Description
This project is node.js sample, this is a graphql backend which connect to postgresql I used typeorm & nexus for creating entities(ORM), query and mutations

## Front-end
For the front-end, refer to these projects:

- [Next.js & React Query](https://github.com/samank8121/next-sample)
- [React & Redux](https://github.com/samank8121/product-react-redux)

## Author
[Saman Kefayatpour](https://www.linkedin.com/in/samankefayatpour/)
