// import {products} from '../database/mock.json'
// import { Context } from '../context'
// import {prisma} from '../database/client'
export default {
  getProducts: async(_: void, args: any, contextValue: any) => {
    const {db} = contextValue

    return await db.product.findMany()
  },
  getProduct: async(_: void, args: any, contextValue: any) => {
    const {db} = contextValue
    const result = await db.product.findFirst({where:{sku: args.sku}})
    return result
  }
}