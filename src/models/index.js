"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = exports.Order = exports.Product = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_json_1 = __importDefault(require("../config/config.json"));
const sequelize = new sequelize_1.Sequelize(config_json_1.default.development);
exports.sequelize = sequelize;
const product_1 = __importDefault(require("./product"));
exports.Product = product_1.default;
const order_1 = __importDefault(require("./order"));
exports.Order = order_1.default;
const orderproduct_1 = __importDefault(require("./orderproduct"));
exports.OrderProduct = orderproduct_1.default;
order_1.default.belongsToMany(product_1.default, { through: orderproduct_1.default });
product_1.default.belongsToMany(order_1.default, { through: orderproduct_1.default });
exports.default = sequelize;
