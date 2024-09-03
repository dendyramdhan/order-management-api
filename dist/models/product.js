"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProductModel = void 0;
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
}
const initProductModel = (sequelize) => {
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
};
exports.initProductModel = initProductModel;
exports.default = Product;
