export interface PostUserOrderDto {
  user_order_delivery_option_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
