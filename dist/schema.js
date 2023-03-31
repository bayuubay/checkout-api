"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const index_1 = __importDefault(require("./schema/index"));
const index_2 = __importDefault(require("./resolvers/index"));
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: index_1.default,
    resolvers: index_2.default
});
exports.default = schema;
