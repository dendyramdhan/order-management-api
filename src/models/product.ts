import { Model, DataTypes, Sequelize } from 'sequelize';
import Order from './order';
import OrderProduct from './orderproduct';

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;

  public static initModel(sequelize: Sequelize) {
    Product.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Product',
      }
    );
  }

  public static associate() {
    Product.belongsToMany(Order, { through: OrderProduct });
  }
}

export default Product;
