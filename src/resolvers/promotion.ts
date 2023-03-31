import {prisma} from '../database/client'
export default {
  getPromotions: async() => {
    return await prisma.promotion.findMany({
      include: {
        item:true,
        type: true,
        bonus_item: true
      }
    })
  },
  getPromotion: async(_: void, args: any ) => {
    const result = await prisma.promotion.findUnique({
      where:{id: args.id},       
      include: {
        item:true,
        type: true,
        bonus_item: true
    }})
    return result
  }
}