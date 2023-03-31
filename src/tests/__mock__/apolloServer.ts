import { ApolloServer } from "@apollo/server";
// import { MockList, MockStore } from '@graphql-tools/mock';
import typeDefs from "../../schema";
import {Product} from './product_mock'
import {makeExecutableSchema} from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

const resolvers = {
  Query: {
    products: () => Product,
    hello: () => "Hello",
    product: (_, args) => {
      const {sku} = args
      return Product.find(p=>p.sku === sku)
    }
  }
}

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export const mockServer = new ApolloServer({
  schema
})