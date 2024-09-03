"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOrderProductModel = void 0;
const sequelize_1 = require("sequelize");
class OrderProduct extends sequelize_1.Model {
}
const initOrderProductModel = (sequelize) => {
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
};
exports.initOrderProductModel = initOrderProductModel;
exports.default = OrderProduct;
