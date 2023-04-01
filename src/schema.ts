import {makeExecutableSchema} from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import { readFileSync } from "fs";
import path from "path";
import resolvers from "./resolvers/index";

const typeDefs = readFileSync(path.join(__dirname + '/schema/schema.graphql'), {encoding: 'utf-8'})

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema