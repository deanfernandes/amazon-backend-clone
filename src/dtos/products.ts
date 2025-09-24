export interface PostProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  product_category_ids: number[];
}
