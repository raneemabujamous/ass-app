import { Exclude, Expose ,Type} from 'class-transformer';


export class Product {

  id: number;


  sku: string;


  name: string;

  price : number
}

export class ProductVariant {

  product_variant_id: number;


  product_id: number;


  size: string;   // e.g., "M"


  color: string;  // e.g., "BLACK"
}
