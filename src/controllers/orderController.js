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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.getOrders = void 0;
const order_1 = __importDefault(require("../models/order"));
const product_1 = __importDefault(require("../models/product"));
const orderproduct_1 = __importDefault(require("../models/orderproduct"));
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerName, orderDate, page = 1, limit = 10 } = req.query;
        const where = {};
        if (customerName)
            where.customerName = customerName;
        if (orderDate)
            where.createdAt = orderDate;
        const orders = yield order_1.default.findAndCountAll({
            where,
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit),
            include: orderproduct_1.default
        });
        res.json({
            total: orders.count,
            pages: Math.ceil(orders.count / Number(limit)),
            data: orders.rows
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
exports.getOrders = getOrders;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, products } = req.body;
    if (!products || products.length === 0) {
        res.status(400).json({ error: 'Order must contain at least one product.' });
        return;
    }
    const order = yield order_1.default.create({ customerName });
    let totalPrice = 0;
    for (const product of products) {
        const dbProduct = yield product_1.default.findByPk(product.productId);
        if (!dbProduct)
            continue;
        const orderProduct = yield orderproduct_1.default.create({
            orderId: order.id,
            productId: product.productId,
            quantity: product.quantity,
            totalPrice: dbProduct.price * product.quantity
        });
        totalPrice += orderProduct.totalPrice;
    }
    order.totalPrice = totalPrice;
    yield order.save();
    res.json(order);
});
exports.createOrder = createOrder;
// Add other methods for editing, deleting, and viewing order details similarly
