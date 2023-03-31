import { ApolloServer } from "@apollo/server";
import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import {Product} from './__mock__/product_mock'
import schema from '../schema';
import assert from "assert";
import { mockServer } from "./__mock__/apolloServer";
beforeAll(async () => {
  await mockServer.start()
})

describe('Testing starting server',() => {
  it('Starting server and return hello string',async () => {
    const response = await mockServer.executeOperation({
      query: 'query SayHello{hello}'
    })
    
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.hello).toBe('Hello')
  })
})

describe('Testing products query', () => {
  it('Return all product data from query', async () => {
    const query = `
      query GetProducts {
        products {
          sku
          name
          price
          inventory_qty
        }
      }
    `
    const response = await mockServer.executeOperation({query})
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.products).toEqual(Product)
  })

  it('Should return single product data from query',async () => {
    const sku = '43N23P'
    const query = `
    query GetProduct($sku: String!) {
      product(sku: $sku) {
        sku
        name
        price
        inventory_qty
      }
    }
  `
  const response = await mockServer.executeOperation({query, variables: {sku}})
  assert(response.body.kind === 'single')
  expect(response.body.singleResult.data?.product).toEqual(Product.find(p => p.sku === sku))
  })
})

