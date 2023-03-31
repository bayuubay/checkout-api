"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_json_1 = require("../database/mock.json");
const resolvers = {
    Query: {
        hello: () => {
            return "Hello";
        },
        products: () => {
            return mock_json_1.products;
        }
    }
};
exports.default = resolvers;
