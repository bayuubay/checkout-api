import express from "express";
import http from 'http';
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import schema from './schema';
import { Context, createContext, prisma } from "./context";


const start = async (port: number): Promise<void> => {
  const app = express();
  const httpServer = http.createServer(app)

  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
  });
  await server.start()
  app.use('/graphql', cors(), express.json(), expressMiddleware(server, {context: async() => ({db: prisma, msg: "this is context"})}));
  await httpServer.listen(port, ()=> console.log('start at http://localhost:3000/graphql')) 
}

start(3000)




