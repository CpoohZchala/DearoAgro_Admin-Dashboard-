// models/Product.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  harvestId: string;
}
