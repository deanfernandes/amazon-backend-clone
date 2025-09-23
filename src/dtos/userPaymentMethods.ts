import { UserPaymentMethodType } from "../models/userPaymentMethod.js";

export interface PostUserPaymentMethodDto {
  type: UserPaymentMethodType;
  card_number?: string;
  cardholder_name?: string;
  security_code?: string;
  expiry_month?: number;
  expiry_year?: number;
  paypal_email?: string;
}

export interface GetUserPaymentMethodDto {
  id: number;
  type: UserPaymentMethodType;
  card_number?: string;
  cardholder_name?: string;
  expiry_month?: string;
  expiry_year?: string;
  paypal_email?: string;
  user_id: number;
}
