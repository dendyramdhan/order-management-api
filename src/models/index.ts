import { Sequelize, Dialect } from 'sequelize';
import config from '../../config/config.json';
import Order from './order';
import Product from './product';
import OrderProduct from './orderproduct';

// Define Sequelize configuration
const dbConfig = {
  username: config.development.username,
  password: config.development.password,
  database: config.development.database,
  host: config.development.host,
  dialect: config.development.dialect as Dialect,
  storage: config.development.storage,
};

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password || undefined,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
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
