"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = exports.Order = exports.Product = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_json_1 = __importDefault(require("../../config/config.json"));
const order_1 = __importDefault(require("./order"));
exports.Order = order_1.default;
const product_1 = __importDefault(require("./product"));
exports.Product = product_1.default;
const orderproduct_1 = __importDefault(require("./orderproduct"));
exports.OrderProduct = orderproduct_1.default;
// Define Sequelize configuration
const dbConfig = {
    username: config_json_1.default.development.username,
    password: config_json_1.default.development.password,
    database: config_json_1.default.development.database,
    host: config_json_1.default.development.host,
    dialect: config_json_1.default.development.dialect,
    storage: config_json_1.default.development.storage,
};
// Initialize Sequelize
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password || undefined, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
});
exports.sequelize = sequelize;
// Initialize models
order_1.default.initModel(sequelize);
product_1.default.initModel(sequelize);
orderproduct_1.default.initModel(sequelize);
// Set up associations
order_1.default.associate();
product_1.default.associate();
orderproduct_1.default.associate();
exports.default = sequelize;
