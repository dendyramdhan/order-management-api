import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Product'
  }
);

export default Product;
