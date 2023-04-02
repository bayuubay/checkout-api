import { prisma } from "../database/client"
export default {
  getPromotions: async(_:void,__:any,{db}) => {
    return await db.promotion.findMany({
      include: {
        item:true,
        type: true,
        bonus_item: true
      }
    })
  },
  getPromotion: async(_: void, args: any, {db} ) => {
    const result = await db.promotion.findUnique({
      where:{id: args.id},       
      include: {
        item:true,
        type: true,
        bonus_item: true
    }})
    return result
  }
}

export const handle_promotion = async (data: any): Promise<void> => {
  try {
    const {order_id, t} = data
    const db = t ?? prisma
    const promotion = await prisma.promotion.findMany({
      include: {
        type: true,
        item: true,
        bonus_item: true
      }
    })    
    const order = await prisma.order.findUnique({
      where: {id: order_id},
      include:{
        order_detail:{
          include:{
            product: true
          }
        }
      }
    })
    
    let unique_sku = [...new Set(order?.order_detail.map(item => item.product_sku))]

    let ordered_product: Array<any> = []
    let additional_order_detail: Array<any> = []
    let order_promo_data: Array<any> = []
    if(order?.order_detail){
      for (const sku of unique_sku) {
        const obj = {
          sku,
          type: '',
          qty: 0,
          ammount: 0
        }
        for (const p of order.order_detail) {
          if(sku === p.product_sku && p.order_type === 'regular'){
            obj.qty += p.qty
            obj.ammount += p.price
            obj.type = p.order_type
          } else if(sku === p.product_sku && p.order_type === 'bonus'){
            obj.qty += p.qty
            obj.ammount += p.price
            obj.type = p.order_type
          }
        }
        ordered_product.push(obj)
      }
    }

    let total_price = 0
    ordered_product.forEach(({ammount})=>total_price+=ammount)
    for (let data of ordered_product) {
      //check each promotion
      for (const promo of promotion) {
        if(data?.sku === promo.item_sku){
          if(promo.percentage !== 0){
            if(data.qty >= promo.min_qty){
              data.ammount *= (1 - promo.percentage)
              order_promo_data.push({order_id, promotion_id: promo.id})
            }
          } else if(promo.quantity !== 0){
            if(data.qty >= promo.min_qty){
              let price_per_item = promo.item.price
              let rem = data.qty % promo.min_qty
              let disc_qty = data.qty - rem
              let undiscounted = rem * price_per_item
              let final_qty = disc_qty * (promo.min_qty - promo.quantity)/promo.min_qty             
              data.ammount = undiscounted + (price_per_item * final_qty)
              order_promo_data.push({order_id, promotion_id: promo.id})
            }
          } else if(promo.price !==0){
            //add handle for price dicount rule
            
          } else if(promo.bonus_item_sku){
            //handled from order
            let existed_bonus = ordered_product.find(d => {
              return d.sku === promo.bonus_item_sku && d.type === 'bonus'
            })
            if(!existed_bonus?.qty || data.qty > existed_bonus?.qty){
              let addition = {
                qty: (data?.qty - existed_bonus?.qty) || 1,
                price: 0,
                product_sku: promo.bonus_item_sku,
                order_id,
                order_type: 'bonus'
              }

              if(promo.bonus_item){
                if(promo.bonus_item.inventory_qty > 0){
                  additional_order_detail.push(addition)
                }
              }
              order_promo_data.push({order_id, promotion_id: promo.id})
            }
          }
        }
      }
    }
    //update order data
    let new_total_price = 0
    ordered_product.map(d => new_total_price += d.ammount)
    await db.order.update({
      where: {id: order_id},
      data: {
        total_price: new_total_price
      },
    })
    additional_order_detail.forEach(async(d) => {
      let product = await db.product.findUnique({where: {sku: d?.product_sku}})
      await db.orderDetail.create({data: d})
      await db.product.update({where:{sku: d.product_sku}, data:{inventory_qty: (product.inventory_qty - d.qty)}})
    })
    order_promo_data.forEach(async(d)=>{
      let existedOrderPromo = await db.orderPromotion.findUnique({where: {order_promo_id: {order_id: d.order_id, promotion_id: d.promotion_id}}})
      if(!existedOrderPromo) await db.orderPromotion.create({data: d})
    })
  } catch (err) {
    throw err
  } finally {
    prisma.$disconnect()
  }
}