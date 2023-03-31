import {makeExecutableSchema} from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import typeDefs from './schema/index'
import resolvers from "./resolvers/index";

// console.log(typeDefs);

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema