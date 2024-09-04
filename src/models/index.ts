import { Sequelize, Dialect } from 'sequelize';
import config from '../config/database';
import Order from './order';
import Product from './product';
import OrderProduct from './orderproduct';

// Initialize Sequelize using the config for the current environment
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password || undefined,
  {
    host: config.host,
    dialect: config.dialect as Dialect, // Cast config.dialect to Dialect
    storage: config.storage, // Required for SQLite
  }
);

// Initialize models
Order.initModel(sequelize);
Product.initModel(sequelize);
OrderProduct.initModel(sequelize);

// Set up associations
Order.associate();
Product.associate();
OrderProduct.associate();

export { sequelize, Product, Order, OrderProduct };
export default sequelize;
