import {prisma} from '../../src/database/client'

// insert status
import {Status} from './status.json'
const seed_status =async () => {
  const exist = (await prisma.type.findMany()).map(d => d.name)
  for (const s of Status) {
    if(!exist.includes(s.name)){
      await prisma.status.create({data: s})
    }
  }
}

//insert type

import {Type} from './type.json'
const seed_type =async () => {
  const exist = (await prisma.type.findMany()).map(d => d.name)
  for (const s of Type) {
    if(!exist.includes(s.name)){
      await prisma.type.create({data: s})
    }
  }
}

//insert product
import {Product} from './product.json'
const seed_product =async () => {
  const exist = (await prisma.product.findMany()).map(d => d.sku)
  for (const s of Product) {
    if(!exist.includes(s.sku)){
      await prisma.product.create({data: s})
    }
  }
}

//insert promotion

import { Promotion } from './promotions.json'
const seed_promotion = async () => {
  const type = await prisma.type.findMany()
  for (const s of Promotion) {
    let data = {
      item_sku: s.item_sku,
      description: s.description,
      type_id: s.type_id,
      percentage: s.percentage,
      quantity: s.quantity,
      min_qty: s.min_qty,
      price: s.price,
      bonus_item_sku: s.bonus_item_sku,
    };
    let type_id = type.find(({name})=> name === s.type)?.id
    if(type_id) data.type_id = type_id
    try {
      if(type.length){
        await prisma.promotion.create({data})
      }
    } catch (error) {
      throw error
    }
  }
}
seed_type(); seed_status(); seed_product();
seed_promotion()