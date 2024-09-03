export interface IOrderRepository {
    findOrders(whereClause: any, limit: number, offset: number): Promise<any>;
    countOrders(whereClause: any): Promise<number>;
    findOrderById(orderId: number): Promise<any>;
    createOrder(customerName: string): Promise<any>;
    updateOrder(order: any): Promise<any>;
    deleteOrderById(orderId: number): Promise<number>;
    deleteOrderProducts(orderId: number): Promise<number>;
    createOrderProduct(orderProductData: any): Promise<any>;
  }
  
  export interface IProductRepository {
    findAllProducts(): Promise<any>;
    findProductById(productId: number): Promise<any>;
  }
  