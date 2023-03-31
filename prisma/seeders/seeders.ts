import {prisma} from '../../src/database/client'

// insert status
import {Status} from './status.json'
const seed_status =async () => {
  for (const s of Status) {
    await prisma.status.create({data: s})
  }
}

//insert type

import {Type} from './type.json'
const seed_type =async () => {
  for (const s of Type) {
    await prisma.type.create({data: s})
  }
  
}

//insert product
import {Product} from './product.json'
const seed_product =async () => {
  
  for (const s of Product) {
    await prisma.product.create({data: s})
  }
}


//insert promotion

import { Promotion } from './promotions.json'
const seed_promotion = async () => {
  const products = await prisma.product.findMany()
  const type = await prisma.type.findMany()
  for (const s of Promotion) {
    await prisma.promotion.create({data: s})
  }
}
seed_type(); seed_status(); seed_product();
seed_promotion()