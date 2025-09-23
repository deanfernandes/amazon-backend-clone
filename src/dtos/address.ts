export interface CreateUserAddressDto {
  address_line_1: string;
  address_line_2?: string;
  postcode: string;
}
export interface UpdateUserAddressDto {
  address_line_1: string;
  address_line_2?: string;
  postcode: string;
}
