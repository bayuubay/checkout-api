import { IResolvers } from "@graphql-tools/utils";
import product from './product'
import order from './order'
import promotion from "./promotion";
const resolvers: IResolvers = {
  Query: {
    hello: (): string => {
      return "Hello"
    },
    product: product.getProduct,
    products: product.getProducts,
    orders: order.getOrder,
    checkout: order.checkout,
    promotions: promotion.getPromotions,
    promotion: promotion.getPromotion,
  },
  Mutation: {
    addOrder: order.addOrder
  }
}

export default resolvers