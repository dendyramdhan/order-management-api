"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOrderModel = void 0;
const sequelize_1 = require("sequelize");
class Order extends sequelize_1.Model {
}
const initOrderModel = (sequelize) => {
    Order.init({
        customerName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        totalPrice: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Order',
    });
};
exports.initOrderModel = initOrderModel;
exports.default = Order;
