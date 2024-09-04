import { Model, DataTypes, Sequelize } from 'sequelize';
import Order from './order';
import Product from './product';

class OrderProduct extends Model {
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public totalPrice!: number;

  // Define associations as class properties
  public readonly Product?: Product;

  public static initModel(sequelize: Sequelize) {
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
  }

  public static associate() {
    OrderProduct.belongsTo(Order, { foreignKey: 'orderId' });
    OrderProduct.belongsTo(Product, { foreignKey: 'productId' });
  }
}

export default OrderProduct;
