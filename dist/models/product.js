"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const order_1 = __importDefault(require("./order"));
const orderproduct_1 = __importDefault(require("./orderproduct"));
class Product extends sequelize_1.Model {
    static initModel(sequelize) {
        Product.init({
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Product',
        });
    }
    static associate() {
        Product.belongsToMany(order_1.default, { through: orderproduct_1.default });
    }
}
exports.default = Product;
