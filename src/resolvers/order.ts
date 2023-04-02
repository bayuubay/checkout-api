import { GraphQLError } from 'graphql';
import { handle_promotion } from './promotion';
export default {
  getOrder: async (_: void, __: any, {db}) => {
    try {
      const result = await db.order.findMany({
        include: {
          order_detail: {
            include: { 
              product: true
            },
          },
          order_promotion: {
            include:{
              promotion: {
                include: {
                  item:true,
                  type: true,
                  bonus_item: true
                }
              }
            }
          },
          status: true
        },
      });
      
      return result
    } catch (error) {
      throw error
    }
  },
  addOrder: async(_: void, args: any, {db} ) => {
    try {
      const {sku, qty} = args.input
      let newOrder
      const product = await db.product.findUnique({where: {sku}})
      const orderStatus = await db.status.findMany()
      const orderStatusWaiting = orderStatus.find(({name})=>name === 'waiting')
      if(!product) throw new GraphQLError("Not Found",{ extensions: {code: "404"}})
      const remaining = product.inventory_qty - qty
      if(remaining < 0 || qty == 0) throw new GraphQLError("Not Sufficient Product Qty", {extensions: {code: "400"}})
      if(product && remaining >= 0){
        newOrder = await db.$transaction(async(t) => {
          let order = await t.order.findFirst({where: {status_id: orderStatusWaiting.id}})
          if(!order) {
            order = await t.order.create({data:{total_price: 0, status_id: orderStatusWaiting.id}})
          }
          const new_order_detail = await t.orderDetail.create({
            data:{
              qty,
              price: product?.price,
              product_sku: product?.sku,
              order_id: order.id
            }
          })
          const total_price = order.total_price + (product.price * qty)
          
          order = await t.order.update({where: {id: order.id}, data: {total_price}})
    
          if(order && new_order_detail){
            await t.product.update({where:{sku}, data:{inventory_qty: (product.inventory_qty - qty)}})
          }
          return order
        })
      }
      newOrder = await db.order.findUnique({
        where: {id: newOrder.id},
        include: {
          status: true,
          order_detail: {
            include:{
              product: true
            }
          }
        }
      })
      return newOrder
    } catch (error) {
      throw error
    } finally {
      db.$disconnect()
    }
  },
  checkout: async (_: void, args: any, {db}) => {
    try {
      const {} = args
      const status = await db.status.findMany()
      const status_waiting = status?.find(({name})=>name === 'waiting')
      let order = await db.order.findFirst({
        where: {status_id: status_waiting?.id}, 
        include:{
          order_detail: {
            include:{
              product: true
            }
          },
          status: true
        }
      })
      await handle_promotion({order_id: order.id, t: db})
      const updated_order = await db.order.findUnique({
        where: {id: order.id},
        include: {
          status: true,
          order_detail: {
            include:{
              product: true
            }
          },
          order_promotion: {
            include:{
              promotion: {
                include: {
                  item:true,
                  type: true,
                  bonus_item: true
                }
              }
            }
          },
        }
      })
      return updated_order
    } catch (error) {
      throw error
    }
  }
}