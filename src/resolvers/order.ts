// import {products, orders, order_details } from '../database/mock.json'
import {prisma} from '../database/client'
// import { Product } from '../schema/product'
import { GraphQLError } from 'graphql';

export default {
  getOrder: async () => {
    const result = await prisma.order.findMany({include: {orderDetail: {include: {product: true}}}})
    return result
  },
  addOrder: async(_: void, args: any ) => {
    try {
      const {sku, qty} = args.input
      let newOrder
      const product = await prisma.product.findUnique({where: {sku}})
      if(!product) throw new GraphQLError("Not Found",{ extensions: {code: "404"}})
      const remaining = product.inventory_qty - qty
      if(remaining < 0 || qty == 0) throw new GraphQLError("Not Sufficient Product Qty", {extensions: {code: "400"}})
      if(product && remaining >= 0){
        newOrder = await prisma.$transaction(async(t) => {
          let order = await t.order.findFirst({where: {status_id: 1}})
          if(!order) {
            order = await t.order.create({data:{total_price: 0, status_id: 1}})
          }
          const newOrderDetail = await t.orderDetail.create({
            data:{
              qty,
              price: product?.price,
              product_sku: product?.sku,
              order_id: order.id
            }
          })

          if(sku === '43N23P') {
            const product = await prisma.product.findUnique({where: {sku: '234234'}})
            if(product?.inventory_qty && product?.inventory_qty >= 1) {
              await t.orderDetail.create({
                data:{
                  qty,
                  price: 0,
                  product_sku: product?.sku,
                  order_id: order.id
                }
              })
              await t.product.update({where:{sku: '234234'}, data:{inventory_qty: (product.inventory_qty - qty)}})
            }
          }
          const total_price = order.total_price + (product.price * qty)
          
          order = await t.order.update({where: {id: order.id}, data: {total_price}})
    
          if(order && newOrderDetail){
            await t.product.update({where:{sku}, data:{inventory_qty: (product.inventory_qty - qty)}})
          }
          return order
        })
      }
      return newOrder
    } catch (error) {
      throw error
    } finally {
      prisma.$disconnect
    }
  },
  checkout: async (_: void, args: any) => {
    try {
      const {} = args
      const status = await prisma.status.findMany()
      const status_waiting = status?.find(({name})=>name === 'waiting')
      let order = await prisma.order.findFirst({
        where: {status_id: status_waiting?.id}, 
        include:{
          orderDetail: {
            include:{
              product: true
            }
          },
          status: true
        }})
      let new_total_price = 0
      //handle promotion here
      const promotions = await prisma.promotion.findMany()
      let updated_order = await prisma.$transaction(async (t)=> {
        for (const promo of promotions) {
          const detail = order?.orderDetail.filter(o => o.product.sku === promo.item_sku)
          if(detail?.length){
            let total = await promotionHandler({order, promo, detail, t})
            new_total_price += total
          }
        }
        await t.order.update({where:{id: order?.id}, data:{total_price: new_total_price}})
        return await t.order.findFirst({
          where: {status_id: status_waiting?.id}, 
          include:{
            orderDetail: {
              include:{
                product: true
              }
            },
            status: true
          }})
      })
      console.log(new_total_price);
      
      return updated_order
    } catch (error) {
      
    }
  }
}

const promotionHandler = async (payload: any) => {
  let {order, promo, detail, t} = payload
  let sku = promo.item_sku
  let total = 0
  let price = detail[0].price
  for (const d of detail) {
    total += d.qty
  }
  let total_price = order.total_price
  
  switch (sku) {
    case '120P90':
      if(total >= 3){
        let rem = total % 3
        let initial_price = total * price
        let not_disc = rem * price
        total_price = not_disc + (2/3 * (initial_price - not_disc))       
      }
      break;
    case 'A304SD':
      if(total >= 3){
        total_price = total * price * 0.9
      }
      break;
    default:
      break;
  }
  return total_price
}