export class OrderProductDetailDto {
    productName: string;    // Name of the product
    price: number;          // Price of the product
    quantity: number;       // Quantity of the product ordered
    totalProductPrice: number; // Total price (price * quantity)
  
    constructor(productName: string, price: number, quantity: number, totalProductPrice: number) {
      this.productName = productName;
      this.price = price;
      this.quantity = quantity;
      this.totalProductPrice = totalProductPrice;
    }
  }