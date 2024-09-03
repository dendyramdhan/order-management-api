"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const order_1 = __importDefault(require("./order"));
const product_1 = __importDefault(require("./product"));
class OrderProduct extends sequelize_1.Model {
    static initModel(sequelize) {
        OrderProduct.init({
            orderId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: {
                    model: 'Orders',
                    key: 'id',
                },
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                allowNull: false,
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            totalPrice: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'OrderProduct',
        });
    }
    static associate() {
        OrderProduct.belongsTo(order_1.default, { foreignKey: 'orderId' });
        OrderProduct.belongsTo(product_1.default, { foreignKey: 'productId' });
    }
}
exports.default = OrderProduct;
