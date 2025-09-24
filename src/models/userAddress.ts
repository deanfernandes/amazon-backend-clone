export interface UserAddress {
  id: number;
  address_line_1: string;
  address_line_2: string | null;
  postcode: string;
  user_id: number;
}
