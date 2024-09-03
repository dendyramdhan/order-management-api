"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const product_1 = __importDefault(require("./product"));
const orderproduct_1 = __importDefault(require("./orderproduct"));
const date_fns_1 = require("date-fns");
class Order extends sequelize_1.Model {
    static initModel(sequelize) {
        Order.init({
            customerName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            totalPrice: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            orderDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW, // Set default value to current date/time
            },
        }, {
            sequelize,
            modelName: 'Order',
        });
    }
    static associate() {
        Order.belongsToMany(product_1.default, { through: orderproduct_1.default });
        Order.hasMany(orderproduct_1.default, { foreignKey: 'orderId' });
    }
    // Override the toJSON method to format orderDate
    toJSON() {
        const attributes = Object.assign({}, this.get());
        attributes.orderDate = (0, date_fns_1.format)(this.orderDate, 'yyyy-MM-dd');
        return attributes;
    }
}
exports.default = Order;
