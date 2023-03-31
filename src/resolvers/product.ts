// import {products} from '../database/mock.json'
import {prisma} from '../database/client'
export default {
  getProducts: async() => {
    return await prisma.product.findMany()
  },
  getProduct: async(_: void, args: any ) => {
    const result = await prisma.product.findFirst({where:{sku: args.sku}})
    return result
  }
}