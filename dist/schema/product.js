"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
  type Product {
    sku: String!
    name: String
    price: Float
    inventory_qty: Int
  }

  type Query {
    products: [Product]
    product(sku: String!): Product
  }

  type Mutation {
    addProduct(sku: String!, name: String!, price: Float!, inventory_qty: Int): Product
    updateQty(sku: String!, inventory_qty: Int!): Product
  }
`;