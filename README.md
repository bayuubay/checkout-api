# Shopping API

This project comply with the requirement for **[fita](fita.co.id)** backend technical test for variant 1 - the **Sopping API**

This project built on Node.js (TypeScript), Express, Apollo GraphQL, Prisma, SQLite, and Jest.

## Requirements
Node.js (v16 or later)

## Getting started
- Clone the repository: `git clone https://github.com/bayuubay/checkout-api`
- Install the dependencies: `npm install`
- Create the SQLite database: `npx prisma migrate dev`
- Start the server: `npm run start:dev`
- Open `http://localhost:3000/graphql` in your browser to access the GraphQL playground.

## Get the binary files
- go to https://github.com/bayuubay/checkout-api
- go to `Actions` tab
- choose succeed workflow
- at the Artifacts section there is binary files called `shopping_api_binary`
- click to download
- go to terminal
- navigate to dowloaded binary directory
- run `./shopping_api_binary`

## Project structure
The project has the following structure:

```
.
├── src/
│   ├── server.ts           # The main server file
│   ├── schema.ts           # The GraphQL schema
│   ├── context.ts          # The Custom context for Apollo Graphql Server
│   ├── resolvers/          # The GraphQL resolvers
│   ├── database/           # The Prisma database connection
│   └── @types/             # Type definitions
├── tests/
│   ├── __mock__/           # Mocking functions for testing
│   ├── resolvers.test.ts   # Tests for the GraphQL resolvers
│   └── setup.ts            # Setup file for Jest
├── prisma/
│   ├── schema.prisma       # The Prisma schema
│   ├── migrations/         # The Prisma migrations
│   └── seeds/              # The Prisma seed data
├── .gitignore
├── jest.config.js          # Jest configuration file
├── tsconfig.json           # Typescript config file 
└── package.json
```

## Scripts
```
npm run compile
```
Compiling typescript project into javascript project

```
npm run migrate:dev
```
Running prisma migration

```
npm run seed:dev
```
Running seeder file

```
npm run start:dev
```
Start the server in `watch mode` for development env

```
npm run start:prod
```
Start the server in production env

```
npm run test
```
Running jest example unit testing

```
npm run build
```
Building the app into executable binary file named `shopping_api`


## Technologies
### TypeScript
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It provides static type checking, interfaces, and other advanced features to help write more reliable code.

### Express
Express is a minimalist web framework for Node.js that provides a set of robust features for web and mobile applications.

### Apollo GraphQL
Apollo GraphQL is a set of open-source tools and services that simplify the development and management of GraphQL APIs.

### Prisma
Prisma is a modern database toolkit that provides a type-safe and intuitive way to access databases.

### SQLite
SQLite is a lightweight, serverless, zero-configuration, transactional SQL database engine.

### Jest
Jest is a JavaScript testing framework that provides a rich set of features, including a built-in mocking library, snapshot testing, and parallel test execution.

