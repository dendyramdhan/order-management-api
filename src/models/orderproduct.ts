import { Model, DataTypes, Sequelize } from 'sequelize';

class OrderProduct extends Model {
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public totalPrice!: number;
}

export const initOrderProductModel = (sequelize: Sequelize) => {
  OrderProduct.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Orders',
          key: 'id',
        },
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderProduct',
    }
  );
};

export default OrderProduct;
