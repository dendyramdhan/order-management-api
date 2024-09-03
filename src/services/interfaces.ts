export interface IOrderService {
    getOrders(customerName: string, orderDate: string, page: number, limit: number): Promise<any>;
    getOrderDetails(orderId: number): Promise<any>;
    createNewOrder(customerName: string, products: any[]): Promise<any>;
    updateExistingOrder(orderId: number, customerName: string, products: any[]): Promise<any>;
    deleteExistingOrder(orderId: number): Promise<any>;
  }
  
  export interface IProductService {
    getProducts(): Promise<any>;
  }
  