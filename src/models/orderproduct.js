"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class OrderProduct extends sequelize_1.Model {
}
OrderProduct.init({
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: index_1.default,
    modelName: 'OrderProduct'
});
exports.default = OrderProduct;
