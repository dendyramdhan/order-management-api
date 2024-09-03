import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class Order extends Model {
  public id!: number;
  public customerName!: string;
  public totalPrice!: number;
}

Order.init(
  {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Order'
  }
);

export default Order;
