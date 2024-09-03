"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = exports.Order = exports.Product = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_json_1 = __importDefault(require("../../config/config.json"));
// Load and cast the configuration
const dbConfig = {
    username: config_json_1.default.development.username,
    password: config_json_1.default.development.password,
    database: config_json_1.default.development.database,
    host: config_json_1.default.development.host,
    dialect: config_json_1.default.development.dialect,
    storage: config_json_1.default.development.storage,
};
// Initialize Sequelize
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password || undefined, // Handle null password by converting to undefined
{
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
});
exports.sequelize = sequelize;
// Import models and initialize them with the sequelize instance
const product_1 = __importStar(require("./product"));
exports.Product = product_1.default;
const order_1 = __importStar(require("./order"));
exports.Order = order_1.default;
const orderproduct_1 = __importStar(require("./orderproduct"));
exports.OrderProduct = orderproduct_1.default;
(0, product_1.initProductModel)(sequelize);
(0, order_1.initOrderModel)(sequelize);
(0, orderproduct_1.initOrderProductModel)(sequelize);
// Define associations
order_1.default.belongsToMany(product_1.default, { through: orderproduct_1.default });
product_1.default.belongsToMany(order_1.default, { through: orderproduct_1.default });
exports.default = sequelize;
