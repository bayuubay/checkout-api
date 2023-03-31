"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
  type Order {
    id: ID!
    total_price: Float
    order_detail: [OrderDetail]
  }

  type OrderDetail {
    id: ID!
    qty: Int
    price: Float
    product: Product
  }

  type Query {
    orders: [Order]
    order(id: ID!): Order
  }

  type Mutation {
    addOrder(sku: String!): Order
  }
`;
