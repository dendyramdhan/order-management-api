import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class OrderProduct extends Model {
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public totalPrice!: number;
}

OrderProduct.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderProduct'
  }
);

export default OrderProduct;
