import { Exclude, Expose ,Type} from 'class-transformer';


export class Product {

  id: number;


  sku: string;


  name: string;
}

export class ProductVariant {

  id: number;


  product_id: number;


  size: string;   // e.g., "M"


  color: string;  // e.g., "BLACK"


  unitPrice: string; // decimal(12,2) as string


  currency: string;  // e.g., "USD"
}
