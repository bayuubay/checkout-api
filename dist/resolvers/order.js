"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../database/client");
const graphql_1 = require("graphql");
exports.default = {
    getOrder: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield client_1.prisma.order.findMany({ include: { orderDetail: { include: { product: true } } } });
        return result;
    }),
    addOrder: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sku, qty } = args.input;
            let newOrder;
            const product = yield client_1.prisma.product.findUnique({ where: { sku } });
            if (!product)
                throw new graphql_1.GraphQLError("Not Found", { extensions: { code: "404" } });
            const remaining = product.inventory_qty - qty;
            if (remaining < 0 || qty == 0)
                throw new graphql_1.GraphQLError("Not Sufficient Product Qty", { extensions: { code: "400" } });
            if (product && remaining >= 0) {
                newOrder = yield client_1.prisma.$transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
                    let order = yield t.order.findFirst({ where: { status_id: 1 } });
                    if (!order) {
                        order = yield t.order.create({ data: { total_price: 0, status_id: 1 } });
                    }
                    const newOrderDetail = yield t.orderDetail.create({
                        data: {
                            qty,
                            price: product === null || product === void 0 ? void 0 : product.price,
                            product_sku: product === null || product === void 0 ? void 0 : product.sku,
                            order_id: order.id
                        }
                    });
                    const total_price = order.total_price + (product.price * qty);
                    order = yield t.order.update({ where: { id: order.id }, data: { total_price } });
                    if (order && newOrderDetail) {
                        yield t.product.update({ where: { sku }, data: { inventory_qty: (product.inventory_qty - qty) } });
                    }
                    return order;
                }));
            }
            return newOrder;
        }
        catch (error) {
            throw error;
        }
        finally {
            client_1.prisma.$disconnect;
        }
    }),
    checkout: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const {} = args;
            const status = yield client_1.prisma.status.findMany();
            const status_waiting = status === null || status === void 0 ? void 0 : status.find(({ name }) => name === 'waiting');
            const order = yield client_1.prisma.order.findFirst({
                where: { status_id: status_waiting === null || status_waiting === void 0 ? void 0 : status_waiting.id },
                include: {
                    orderDetail: {
                        include: {
                            product: true
                        }
                    },
                    status: true
                }
            });
            const promotions = yield client_1.prisma.promotion.findMany();
            for (const promo of promotions) {
                const detail = order === null || order === void 0 ? void 0 : order.orderDetail.filter(o => o.product.sku === promo.item_sku);
                const updated = yield promotionHandler({ order, promo, detail });
            }
            return order;
        }
        catch (error) {
        }
    })
};
const promotionHandler = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let { order, promo, detail } = payload;
    let sku = promo.item_sku;
    let total = 0;
    detail.map((d) => { return d; });
    console.log(detail, sku);
    return order;
});
