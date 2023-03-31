"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const resolvers = {
    Query: {
        hello: () => {
            return "Hello";
        },
        product: product_1.default.getProduct,
        products: product_1.default.getProducts,
        orders: order_1.default.getOrder,
        checkout: order_1.default.checkout
    },
    Mutation: {
        addOrder: order_1.default.addOrder
    }
};
exports.default = resolvers;
