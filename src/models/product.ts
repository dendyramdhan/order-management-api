import { Model, DataTypes, Sequelize } from 'sequelize';

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
}

export const initProductModel = (sequelize: Sequelize) => {
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
};

export default Product;
