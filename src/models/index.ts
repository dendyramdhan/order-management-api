import { Sequelize, Dialect } from 'sequelize';
import config from '../../config/config.json';

// Define Sequelize configuration interface
interface SequelizeConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
  storage: string;
}

// Load and cast the configuration
const dbConfig: SequelizeConfig = {
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
  dbConfig.password || undefined, // Handle null password by converting to undefined
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
  }
);

// Import models and initialize them with the sequelize instance
import Product, { initProductModel } from './product';
import Order, { initOrderModel } from './order';
import OrderProduct, { initOrderProductModel } from './orderproduct';

initProductModel(sequelize);
initOrderModel(sequelize);
initOrderProductModel(sequelize);

// Define associations
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

// Export the Sequelize instance and models
export { sequelize, Product, Order, OrderProduct };
export default sequelize;
