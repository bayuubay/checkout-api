import express from "express";
import http from 'http';
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import schema from './schema';

const start = async (port: number): Promise<void> => {
  const app = express();
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer}) ]
  });
  await server.start()
  app.use('/graphql', cors(), express.json(), expressMiddleware(server, {}));
  await new Promise((resolve) => httpServer.listen({port}, ()=> resolve))
  console.log(`server start at port ${port}`);
}

start(3000)




