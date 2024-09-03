import { Sequelize, Dialect } from 'sequelize';
import config from '../../config/config.json';

interface SequelizeConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
  storage?: string;
}

const dbConfig: SequelizeConfig = config.development as SequelizeConfig;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username || '', dbConfig.password || '', {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
});

import Product from './product';
import Order from './order';
import OrderProduct from './orderproduct';

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

export { sequelize, Product, Order, OrderProduct };
export default sequelize;
