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
exports.deleteOrder = exports.editOrder = exports.createOrder = exports.getOrderDetails = exports.getOrders = void 0;
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const order_1 = __importDefault(require("../models/order"));
const product_1 = __importDefault(require("../models/product"));
const orderproduct_1 = __importDefault(require("../models/orderproduct"));
const logger_1 = __importDefault(require("../utils/logger"));
// View Order List
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, orderDate, page = 1, limit = 10 } = req.query;
    const whereClause = {};
    if (customerName) {
        whereClause.customerName = {
            [sequelize_1.Op.like]: `%${customerName}%`,
        };
    }
    if (orderDate) {
        const parsedDate = (0, date_fns_1.parseISO)(orderDate);
        whereClause.orderDate = {
            [sequelize_1.Op.between]: [(0, date_fns_1.startOfDay)(parsedDate), (0, date_fns_1.endOfDay)(parsedDate)],
        };
    }
    try {
        // Count the total number of orders matching the query
        const total = yield order_1.default.count({ where: whereClause });
        // Calculate the correct pagination offset
        const offset = (parseInt(page) - 1) * parseInt(limit);
        // Fetch the orders with pagination and include related data
        const orders = yield order_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: orderproduct_1.default,
                    include: [product_1.default],
                },
            ],
            limit: parseInt(limit),
            offset,
        });
        // Format the orders for the response
        const formattedOrders = orders.map((order) => (Object.assign(Object.assign({}, order.toJSON()), { orderDate: (0, date_fns_1.format)(order.orderDate, "yyyy-MM-dd'T'HH:mm:ssXXX") })));
        // Calculate the total number of pages
        const pages = Math.ceil(total / parseInt(limit));
        logger_1.default.info('Orders fetched successfully', {
            customerName,
            orderDate,
            total,
            pages,
        });
        res.status(200).json({
            total,
            pages,
            data: formattedOrders,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching orders', { error });
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
exports.getOrders = getOrders;
// View Order Details
const getOrderDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield order_1.default.findByPk(id, {
            include: [orderproduct_1.default],
        });
        if (!order) {
            logger_1.default.warn('Order not found', { orderId: id });
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        logger_1.default.info('Order details fetched successfully', { orderId: id });
        res.json(order);
    }
    catch (error) {
        logger_1.default.error('Failed to fetch order details', { error });
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});
exports.getOrderDetails = getOrderDetails;
// Create a New Order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, products } = req.body;
    if (!products || products.length === 0) {
        logger_1.default.warn('Attempted to create order without products', { customerName });
        res.status(400).json({ error: 'Order must contain at least one product.' });
        return;
    }
    try {
        const order = yield order_1.default.create({ customerName, totalPrice: 0 });
        let totalPrice = 0;
        for (const product of products) {
            const dbProduct = yield product_1.default.findByPk(product.productId);
            if (!dbProduct) {
                logger_1.default.warn('Product not found while creating order', {
                    productId: product.productId,
                });
                res.status(400).json({ error: `Product with ID ${product.productId} not found.` });
                return;
            }
            const orderProduct = yield orderproduct_1.default.create({
                orderId: order.id,
                productId: product.productId,
                quantity: product.quantity,
                totalPrice: dbProduct.price * product.quantity,
            });
            totalPrice += orderProduct.totalPrice;
        }
        yield order.update({ totalPrice });
        logger_1.default.info('Order created successfully', { orderId: order.id, customerName });
        res.status(201).json(order);
    }
    catch (error) {
        logger_1.default.error('Error creating order', { error });
        res.status(500).json({ error: 'Failed to create order' });
    }
});
exports.createOrder = createOrder;
// Edit an Order
const editOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { customerName, products } = req.body;
    try {
        const order = yield order_1.default.findByPk(id);
        if (!order) {
            logger_1.default.warn('Order not found while editing', { orderId: id });
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        // Update the customer name if provided
        if (customerName) {
            order.customerName = customerName;
        }
        // Remove existing products in the order and calculate new total price
        yield orderproduct_1.default.destroy({ where: { orderId: id } });
        let totalPrice = 0;
        for (const product of products) {
            const dbProduct = yield product_1.default.findByPk(product.productId);
            if (!dbProduct)
                continue;
            const orderProduct = yield orderproduct_1.default.create({
                orderId: id,
                productId: product.productId,
                quantity: product.quantity,
                totalPrice: dbProduct.price * product.quantity,
            });
            totalPrice += orderProduct.totalPrice;
        }
        // Update the total price and save the order
        order.totalPrice = totalPrice;
        yield order.save();
        logger_1.default.info('Order updated successfully', { orderId: id, customerName: order.customerName });
        res.json(order);
    }
    catch (error) {
        logger_1.default.error('Failed to update order', { error });
        res.status(500).json({ error: 'Failed to update order' });
    }
});
exports.editOrder = editOrder;
// Delete an Order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield order_1.default.findByPk(id);
        if (!order) {
            logger_1.default.warn('Order not found while deleting', { orderId: id });
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        yield order_1.default.destroy({ where: { id } });
        logger_1.default.info('Order deleted successfully', { orderId: id });
        res.json({ success: true });
    }
    catch (error) {
        logger_1.default.error('Failed to delete order', { error });
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
exports.deleteOrder = deleteOrder;
