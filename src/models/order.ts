import { Model, DataTypes, Sequelize } from 'sequelize';

class Order extends Model {
  public id!: number;
  public customerName!: string;
  public totalPrice!: number;
}

export const initOrderModel = (sequelize: Sequelize) => {
  Order.init(
    {
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
};

export default Order;
