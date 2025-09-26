export interface PostProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  product_category_ids: number[];
  product_option_ids: number[];
}

export interface PutProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  product_category_ids: number[];
}

export interface GetProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  created_at: string;
}
