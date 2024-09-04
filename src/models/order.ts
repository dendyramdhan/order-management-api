import { Model, DataTypes, Sequelize } from 'sequelize';
import Product from './product';
import OrderProduct from './orderproduct';
import { format } from 'date-fns';

class Order extends Model {
  public id!: number;
  public customerName!: string;
  public totalPrice!: number;
  public orderDate!: Date;

  // Define associations as class properties
  public readonly OrderProducts?: OrderProduct[];

  public static initModel(sequelize: Sequelize) {
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
        orderDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW, // Set default value to current date/time
        },
      },
      {
        sequelize,
        modelName: 'Order',
      }
    );
  }

  public static associate() {
    Order.belongsToMany(Product, { through: OrderProduct });
    Order.hasMany(OrderProduct, { foreignKey: 'orderId' });
  }

  // Override the toJSON method to format orderDate
  public toJSON() {
    const attributes = Object.assign({}, this.get());
    attributes.orderDate = format(this.orderDate, 'yyyy-MM-dd');
    return attributes;
  }
}

export default Order;
